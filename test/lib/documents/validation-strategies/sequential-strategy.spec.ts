import 'mocha';

import { isUsable } from 'af-conditionals';
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import cloneDeep = require('lodash/cloneDeep');
import util = require('util');

import {
  DEFAULT_STRING_PROPERTY_NAME,
  DEFAULT_STRING_PROPERTY_OPTIONS,
  Document,
  DocumentEntity,
  propertyClassificationMap,
  SequentialValidationStrategy,
  StringProperty,
  StringPropertyOptions,
  ValidationStrategyOptions,
} from '../../../../src/lib';
import { MULTIPLE_ARRAYS_TEST_OBJECT } from '../document-test-data';

const setTimeoutPromise = util.promisify(setTimeout);

chai.use(chaiAsPromised);
const expect = chai.expect;

// tslint:disable:no-unused-expression no-null-keyword

interface SequentialValidationStrategyTesterOptions
  extends ValidationStrategyOptions {
  delayResponse?: boolean;
}

class SequentialValidationStrategyTester<
  T extends Record<string, any> = Record<string, any>,
  O extends SequentialValidationStrategyTesterOptions = SequentialValidationStrategyTesterOptions
> extends SequentialValidationStrategy<T, O> {
  protected async _validate(data: T): Promise<boolean> {
    if (this.options.delayResponse) {
      await setTimeoutPromise(200);
    }
    return await super._validate(data);
  }

  protected _validateOptions(newOptions: O): void {
    super._validateOptions(newOptions);

    if (!isUsable(this.options.delayResponse)) {
      this.options.delayResponse = false;
    }
  }
}

class StringDelayedValidateProperty extends StringProperty {
  public watchMe = false;
  protected releaseValidation = false;

  public isValidating(): boolean {
    const _isValidating = super.isValidating();
    if (this.watchMe && !this.releaseValidation) {
      this.releaseValidation = true;
    }
    return _isValidating;
  }

  protected async _validate(): Promise<boolean> {
    if (this.watchMe) {
      this.releaseValidation = false;
      while (!this.releaseValidation) {
        await setTimeoutPromise(40);
      }
    }
    return await super._validate();
  }
}

function stringDelayedValidationFactory(
  value: string,
  name?: string,
  displayName?: string,
  defaultName = DEFAULT_STRING_PROPERTY_NAME,
  options?: StringPropertyOptions
): StringDelayedValidateProperty {
  const pc = StringProperty.getNextPropertyCount();

  if (!isUsable(options)) {
    options = cloneDeep(DEFAULT_STRING_PROPERTY_OPTIONS);
    // For consistent creation of default property names we make options.name
    // an empty string here.
    options.name = '';
  }
  options!.name = name || options!.name || defaultName + '_' + pc;
  options!.displayName = displayName || options!.displayName || options!.name;

  return new StringDelayedValidateProperty(value, options!);
}

describe('SequentialValidationStrategy class', function() {
  describe('Testing functionality of the class', function() {
    let document: Document | undefined;
    let vst: SequentialValidationStrategyTester;

    function setupTestObjects(
      options: SequentialValidationStrategyTesterOptions | undefined
    ): void {
      if (!isUsable(document)) {
        document = new Document(MULTIPLE_ARRAYS_TEST_OBJECT);
      }
      vst = new SequentialValidationStrategyTester(undefined, options);
    }

    xit(' 1. tests setting our defaults based upon our parent', function() {
      document = new Document(MULTIPLE_ARRAYS_TEST_OBJECT);
      vst = new SequentialValidationStrategyTester(document);
      expect(vst).to.not.be.undefined;
      document = undefined;
    });

    xit(' 2. validates a using a SequentialValidationStrategy', async function() {
      setupTestObjects(undefined);
      expect(await vst.validate(document!.getEntities())).to.be.true;
      document = undefined;
    });

    it(' 3. validates a using a special StringDelayedValidationProperty', async function() {
      let theEvilProperty: StringDelayedValidateProperty;

      async function firstTest() {
        expect(await vst.validate(document!.getEntities())).to.be.true;
      }

      async function secondTest() {
        // ! Potential Problem when dealing with a mutable field list within
        // ! a document.
        // This is a little tricky... we need to test if an Entity isValidating
        // that it actually waits. So this means that we have the same Entity
        // in two separate Documents. Because at the Document level we make
        // sure we don't re-enter our validation process. BUT if someone
        // created their own Entity (Property or Document) AND then added it
        // to two or more Documents and they happen to try to validate one of
        // the other Document (or the Entity really what we do here) WHILE
        // a Document that contained that Entity was also validating AND it
        // happened to be validating that Entity at the same exact time, we
        // need to wait. I MAY be a bit protective (MJC)...
        await setTimeoutPromise(10);
        while (!theEvilProperty.isValidating()) {
          await setTimeoutPromise(50);
        }
      }

      propertyClassificationMap['name_first'] = {
        classification: 'name_first',
        descriptionName: 'First Name',
        factory: stringDelayedValidationFactory,
        options: {
          displayName: 'First Name',
          maxLength: 255,
          minLength: 1,
          name: 'name_first'
        } as StringPropertyOptions
      };

      // TODO: Update the test code to have two documents that have the same
      // TODO: field in it. That would be the only way the code in the
      // TODO: _validateEntity method could be triggered.
      setupTestObjects(undefined);
      const firstNames = document!.getEntity('first_names');
      theEvilProperty = (firstNames as DocumentEntity[])[0] as StringDelayedValidateProperty;
      theEvilProperty.watchMe = true;
      await Promise.all([firstTest(), secondTest()]);
      document = undefined;
    });

    xit(
      ' 4. tests calling validation twice, first validation ' +
        'is delayed 200ms',
      async function() {
        async function firstTest() {
          expect(await vst.validate(document!.getEntities())).to.be.true;
        }

        async function secondTest() {
          // We only put this test in the loop SO we can get coverages
          // of the isValidating method
          try {
            let i = 0;
            while (vst.isValidating()) {
              i++;
              if (i === 1) {
                expect(await vst.validate(document!.getEntities())).to.be
                  .false; // This is definitely wrong
              }
            }
            // We will never get here...
            expect(true).to.be.false;
          } catch (err) {
            // This is an error indicating that validate was already
            // running.
            expect(err.message).to.equal(
              'A call to validate was made while validation is ' +
                'already running for this validation strategy.'
            );
          }
        }

        setupTestObjects(undefined);
        await Promise.all([firstTest(), secondTest()]);
        document = undefined;
      }
    );
  });
});
