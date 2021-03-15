import 'mocha';

import { isUsable } from 'af-conditionals';
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import util = require('util');

import {
  DEFAULT_VALIDATION_STOP_ON_INVALID,
  DEFAULT_VALIDATION_WAIT_INTERVAL,
  DEFAULT_VALIDATION_WAIT_TIMEOUT,
  Document,
  ValidationStrategy,
  ValidationStrategyOptions,
} from '../../../../src/lib';
import { TEST_OBJECT1 } from '../document-test-data';

const setTimeoutPromise = util.promisify(setTimeout);

chai.use(chaiAsPromised);
const expect = chai.expect;

interface ValidationStrategyTesterOptions extends ValidationStrategyOptions {
  delayResponse?: boolean;
}

class ValidationStrategyTester extends ValidationStrategy<
  Record<string, any>,
  ValidationStrategyTesterOptions
> {
  protected async _validate(): Promise<boolean> {
    if (this.options.delayResponse) {
      await setTimeoutPromise(200);
    }
    return Promise.resolve(true);
  }

  protected _validateOptions(
    newOptions: ValidationStrategyTesterOptions
  ): void {
    super._validateOptions(newOptions);

    if (!isUsable(this.options.delayResponse)) {
      this.options.delayResponse = false;
    }
  }
}

describe('ValidationStrategy class', function () {
  describe('Test the construction and options', function () {
    function testValidationStrategyOption(
      loadOptions: ValidationStrategyTesterOptions,
      testOptions: ValidationStrategyTesterOptions
    ): void {
      const vst = new ValidationStrategyTester(undefined, loadOptions);
      const vsto = vst.getOptions();
      expect(vsto).to.deep.equal(testOptions);
    }

    it('ensures all options have valid values', function () {
      const loadOptions: ValidationStrategyTesterOptions = {};

      // All defaults (displayName = name by default)
      const testOptions: ValidationStrategyTesterOptions = {
        delayResponse: false,
        validationStopOnInvalid: DEFAULT_VALIDATION_STOP_ON_INVALID,
        validationWaitInterval: DEFAULT_VALIDATION_WAIT_INTERVAL,
        validationWaitTimeout: DEFAULT_VALIDATION_WAIT_TIMEOUT,
      };

      // Test all defaults
      testValidationStrategyOption(loadOptions, testOptions);

      loadOptions.validationStopOnInvalid = true;
      testOptions.validationStopOnInvalid = true;
      testValidationStrategyOption(loadOptions, testOptions);

      loadOptions.validationWaitInterval = 40;
      testOptions.validationWaitInterval = 40;
      testValidationStrategyOption(loadOptions, testOptions);

      loadOptions.validationWaitTimeout = 1000;
      testOptions.validationWaitTimeout = 1000;
      testValidationStrategyOption(loadOptions, testOptions);
    });
  });

  describe('Testing functionality of the class', function () {
    let document: Document | undefined;
    let vst: ValidationStrategyTester;

    function setupTestObjects(
      options: ValidationStrategyTesterOptions | undefined
    ): void {
      if (!isUsable(document)) {
        document = new Document(TEST_OBJECT1);
      }
      vst = new ValidationStrategyTester(undefined, options);
    }

    it(' 1. tests setting our defaults based upon our parent', function () {
      document = new Document(TEST_OBJECT1);
      vst = new ValidationStrategyTester(document);
      expect(vst).to.not.be.undefined;
      document = undefined;
    });

    it(' 2. validates a default ValidationStrategy', async function () {
      setupTestObjects(undefined);
      expect(await vst.validate(document!.getEntities())).to.be.true;
      document = undefined;
    });

    it(
      ' 3. tests calling validation twice, first validation ' +
        'is delayed 200ms',
      async function () {
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
                expect(await vst.validate(document!.getEntities())).to.be.false; // This is definitely wrong
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
