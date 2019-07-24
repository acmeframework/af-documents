import 'mocha';

import { isUsable } from 'af-conditionals';
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import util = require('util');

import {
  DEFAULT_INVALID_IF_NOT_REQUIRED_AND_EMPTY,
  DEFAULT_NORMALIZE_AFTER_SET,
  DEFAULT_NORMALIZE_BEFORE_VALIDATE,
  DEFAULT_NORMALIZE_IF_VALID,
  DEFAULT_PROPERTY_VALIDATION_WAIT_INTERVAL,
  DEFAULT_PROPERTY_VALIDATION_WAIT_TIMEOUT,
  DEFAULT_REQUIRED,
  DEFAULT_VALIDATION_STOP_ON_INVALID,
  NoopNormalizer,
  Normalizer,
  Property,
  PropertyOptions,
  StringNormalizer,
  StringValidator,
  Validator,
  ValidatorErrorCodes,
} from '../../../src/lib';

const setTimeoutPromise = util.promisify(setTimeout);

chai.use(chaiAsPromised);
const expect = chai.expect;

// tslint:disable:no-unused-expression no-null-keyword

interface PropertyTesterOptions extends PropertyOptions {
  delayResponse?: boolean;
}

abstract class PropertyTester<T> extends Property<T, PropertyTesterOptions> {
  protected async _validate(): Promise<boolean> {
    if (this.options.delayResponse) {
      await setTimeoutPromise(200);
    }
    return await super._validate();
  }

  protected _validateOptions(newOptions: PropertyTesterOptions): void {
    super._validateOptions(newOptions);

    if (!isUsable(this.options.delayResponse)) {
      this.options.delayResponse = false;
    }
  }
}

class StringPropertyTester extends PropertyTester<string> {}
class NumberPropertyTester extends PropertyTester<number> {}
class BooleanPropertyTester extends PropertyTester<boolean> {}

describe('Property class', function() {
  const PROPERTY_NAME = 'Test Property';
  const STRING_DATA = 'Hello World';

  describe('Test the static method getNextPropertyCount', function() {
    it(
      'ensures that successive calls to getNexPropertyCount provides ' +
        'sequential results',
      function() {
        let x = Property.getPropertyCount();
        expect(Property.getNextPropertyCount()).to.equal(++x);
        expect(Property.getNextPropertyCount()).to.equal(++x);
        expect(Property.getNextPropertyCount()).to.equal(++x);
      }
    );
  });

  describe('Test the construction and options', function() {
    it('throws an Error or a TypeError during construction', function() {
      // Data must not be undefined or NULL
      expect(function() {
        // @ts-ignore
        new StringPropertyTester(undefined, {
          name: PROPERTY_NAME,
          required: true
        });
      }).to.throw(Error);

      expect(function() {
        // @ts-ignore
        new StringPropertyTester(null, {
          name: PROPERTY_NAME,
          required: true
        });
      }).to.throw(Error);

      expect(function() {
        // @ts-ignore
        new StringPropertyTester(STRING_DATA, undefined);
      }).to.throw(TypeError);

      expect(function() {
        // @ts-ignore
        new StringPropertyTester(STRING_DATA, null);
      }).to.throw(TypeError);

      expect(function() {
        new StringPropertyTester(STRING_DATA, { name: '' });
      }).to.throw(TypeError);
    });

    it(
      'instantiates a valid Property object with customer normalizers ' +
        'and validators',
      function() {
        const normalizers: Normalizer<string>[] = [new StringNormalizer()];
        const validators: Validator<string>[] = [new StringValidator()];
        expect(
          new StringPropertyTester(
            STRING_DATA,
            { name: PROPERTY_NAME },
            normalizers,
            validators
          )
        ).to.be.an.instanceof(StringPropertyTester);
      }
    );

    function testPropertyOption(
      loadOptions: PropertyTesterOptions,
      testOptions: PropertyTesterOptions
    ): void {
      const spt = new StringPropertyTester(STRING_DATA, loadOptions);
      const spto = spt.getOptions();
      expect(spto).to.deep.equal(testOptions);
    }

    it('ensures all options have valid values', function() {
      const loadOptions: PropertyTesterOptions = {
        name: PROPERTY_NAME
      };

      // All defaults (displayName = name by default)
      const testOptions: PropertyTesterOptions = {
        delayResponse: false,
        displayName: PROPERTY_NAME,
        invalidIfNotRequiredAndEmpty: DEFAULT_INVALID_IF_NOT_REQUIRED_AND_EMPTY,
        name: PROPERTY_NAME,
        normalizeAfterSet: DEFAULT_NORMALIZE_AFTER_SET,
        normalizeBeforeValidate: DEFAULT_NORMALIZE_BEFORE_VALIDATE,
        normalizeIfValid: DEFAULT_NORMALIZE_IF_VALID,
        required: DEFAULT_REQUIRED,
        validationStopOnInvalid: DEFAULT_VALIDATION_STOP_ON_INVALID,
        validationWaitInterval: DEFAULT_PROPERTY_VALIDATION_WAIT_INTERVAL,
        validationWaitTimeout: DEFAULT_PROPERTY_VALIDATION_WAIT_TIMEOUT
      };

      // Test all defaults
      testPropertyOption(loadOptions, testOptions);

      loadOptions.displayName = 'My Test Property';
      testOptions.displayName = 'My Test Property';
      testPropertyOption(loadOptions, testOptions);

      loadOptions.invalidIfNotRequiredAndEmpty = true;
      testOptions.invalidIfNotRequiredAndEmpty = true;
      testPropertyOption(loadOptions, testOptions);

      loadOptions.normalizeAfterSet = true;
      testOptions.normalizeAfterSet = true;
      testPropertyOption(loadOptions, testOptions);

      loadOptions.normalizeBeforeValidate = true;
      testOptions.normalizeBeforeValidate = true;
      testPropertyOption(loadOptions, testOptions);

      loadOptions.required = true;
      testOptions.required = true;
      testPropertyOption(loadOptions, testOptions);

      loadOptions.validationStopOnInvalid = true;
      testOptions.validationStopOnInvalid = true;
      testPropertyOption(loadOptions, testOptions);

      loadOptions.validationWaitInterval = 40;
      testOptions.validationWaitInterval = 40;
      testPropertyOption(loadOptions, testOptions);

      loadOptions.validationWaitTimeout = 1000;
      testOptions.validationWaitTimeout = 1000;
      testPropertyOption(loadOptions, testOptions);
    });
  });

  describe('Testing functionality of the class as a String', function() {
    const STRING_NAME = 'Test String';
    const NEW_STRING_DATA = 'Hello People of the World';
    const EMPTY_STRING_DATA = '';
    const FIRST_HALF_STRING_DATA = 'Hello ';
    const SECOND_HALF_STRING_DATA = 'World';

    const TEST_OPTIONS = [
      { name: STRING_NAME }, // 1
      { name: STRING_NAME, required: true }, // 2
      { name: STRING_NAME }, // 3
      { name: STRING_NAME, normalizeIfValid: true }, // 4
      { name: STRING_NAME }, // 5
      { name: STRING_NAME, required: true }, // 6
      { name: STRING_NAME }, // 7
      { name: STRING_NAME, normalizeBeforeValidate: true }, // 8
      { name: STRING_NAME }, // 9
      { name: STRING_NAME, invalidIfNotRequiredAndEmpty: true }, // 10
      { name: STRING_NAME }, // 11
      { name: STRING_NAME }, // 12
      { name: STRING_NAME }, // 13
      { name: STRING_NAME }, // 14
      {
        name: STRING_NAME,
        required: true,
        validationStopOnInvalid: true
      }, // 15
      { name: STRING_NAME, delayResponse: true } // 16
    ];

    let spt: StringPropertyTester;
    let testNumber = 0;

    beforeEach(function() {
      const options = TEST_OPTIONS[testNumber++];
      spt = new StringPropertyTester(STRING_DATA, options, [
        new NoopNormalizer()
      ]);
    });

    it(' 1. the getName method will return the proper name', function() {
      expect(spt.getName()).to.equal(STRING_NAME);
    });

    it(' 2. isRequired returns true as set in options', function() {
      expect(spt.isRequired()).to.be.true;
    });

    it(' 3. works through the normalize workflow', async function() {
      expect(spt.isNormalized()).to.be.false;
      spt.normalize();
      expect(spt.isNormalized()).to.be.true;

      // this tests alternate paths for full coverage
      spt.reset();
      await spt.validate();
      spt.normalize();
      expect(spt.isNormalized()).to.be.false;
    });

    it(' 4. tests the normalizeIfValid workflow', async function() {
      expect(spt.isNormalized()).to.be.false;
      await spt.validate();
      expect(spt.isNormalized()).to.be.false;
      spt.normalize();
      expect(spt.isNormalized()).to.be.true;
    });

    it(' 5. works through the get/set _value workflow', function() {
      expect(spt.value).to.equal(STRING_DATA);
      spt.value = NEW_STRING_DATA;
      expect(spt.value).to.equal(NEW_STRING_DATA);

      expect(function() {
        // @ts-ignore
        spt.value = null;
      }).to.throw(Error);

      expect(function() {
        spt.value = undefined;
      }).to.throw(Error);

      expect(function() {
        spt.value = EMPTY_STRING_DATA;
      }).to.not.throw();

      // This is for code coverage
      spt.value = EMPTY_STRING_DATA; // Compares to equal and does not reset
    });

    // Regression test
    it(
      ' 6. validates that setting a new value resets the' +
        ' normalize workflow & errors (regression)',
      async function() {
        expect(spt.value).to.equal(STRING_DATA);
        spt.value = EMPTY_STRING_DATA;

        // Get some errors created (required option = true)
        expect(await spt.validate()).to.be.false;
        expect(spt.getErrors().length).to.equal(1);

        // And normalize our data
        spt.normalize();
        expect(spt.isNormalized()).to.be.true;

        spt.value = NEW_STRING_DATA;
        expect(spt.value).to.equal(NEW_STRING_DATA);
        expect(spt.getErrors().length).to.equal(0);
        expect(spt.isNormalized()).to.be.false;
      }
    );

    it(' 7. validates a default Property (String)', async function() {
      expect(await spt.validate()).to.be.true;

      // This 2nd call is for code coverage
      expect(await spt.validate()).to.be.true;
    });

    it(' 8. tests if the value is normalized before validation', async function() {
      expect(spt.isNormalized()).to.be.false;
      expect(await spt.validate()).to.be.true;
      expect(spt.isNormalized()).to.be.true;

      // These test passes are for coverage
      spt.value = NEW_STRING_DATA; // Just reset normalized...
      spt.normalize();
      expect(await spt.validate()).to.be.true;
    });

    it(' 9. tests isValid prior to validation.', async function() {
      expect(spt.isValid()).to.be.false;
      expect(await spt.validate()).to.be.true;
    });

    it(
      '10. tests if the data is empty, required is false, and' +
        ' invalidIfNotRequiredAndEmpty is true',
      async function() {
        spt.value = EMPTY_STRING_DATA;
        expect(await spt.validate()).to.be.false;
        expect(spt.getErrors()[0].code).to.be.equal(ValidatorErrorCodes.Empty);
      }
    );

    it(
      '11. tests if the data is empty, and required and ' +
        'invalidIfNotRequiredAndEmpty are false',
      async function() {
        spt.value = EMPTY_STRING_DATA;
        expect(await spt.validate()).to.be.true;
      }
    );

    it('12. uses toString to get the data', function() {
      // toString should normalize the data
      expect(spt.isNormalized()).to.be.false;
      expect(spt.toString())
        .to.be.a('string')
        .to.equal(STRING_DATA);
      expect(spt.isNormalized()).to.be.true;
    });

    it('13. uses valueOf to get the data', function() {
      // valueOf should normalize the data
      expect(spt.isNormalized()).to.be.false;
      expect(spt.valueOf())
        .to.be.a('string')
        .to.equal(STRING_DATA);
      expect(spt.isNormalized()).to.be.true;
    });

    it(
      '14. uses valueOf to add two GenericStringPropertyTester' +
        ' objects together',
      function() {
        spt.value = FIRST_HALF_STRING_DATA;
        const otherSp = new StringPropertyTester(SECOND_HALF_STRING_DATA, {
          name: 'Test String #2'
        });

        // @ts-ignore: allow objects to be added together
        const result: string = spt + otherSp;
        expect(result).to.equal(STRING_DATA);
      }
    );

    it(
      '15. tests if the data is empty, required is true, and' +
        ' stopValidationOnInvalid is true',
      async function() {
        spt.value = EMPTY_STRING_DATA;
        expect(await spt.validate()).to.be.false;
        expect(spt.getErrors()[0].code).to.be.equal(
          ValidatorErrorCodes.RequiredAndEmpty
        );
      }
    );

    it(
      '16. tests calling validation twice, first validation ' +
        'is delayed 200ms',
      async function() {
        async function firstTest() {
          expect(await spt.validate()).to.be.true;
        }

        async function secondTest() {
          // We only put this test in the loop SO we can get coverages
          // of the isValidating method
          try {
            let i = 0;
            while (spt.isValidating()) {
              i++;
              if (i === 1) {
                expect(await spt.validate()).to.be.false; // This is definitely wrong
              }
            }
            // We will never get here...
            expect(true).to.be.false;
          } catch (err) {
            // This is an error indicating that validate was already
            // running.
            expect(err.message).to.equal(
              'You have called validate() while another' +
                ' validate() call is running.'
            );
          }
        }

        await Promise.all([firstTest(), secondTest()]);
      }
    );
  });

  describe('Testing validation of the class as a Number', function() {
    const NUMBER_DATA = 102696;
    const NUMBER_NAME = 'Test Number';
    const NAN_NUMBER_DATA = NaN;
    const FIRST_HALF_NUMBER_DATA = 100000;
    const SECOND_HALF_NUMBER_DATA = 2696;

    const TEST_OPTIONS = [
      { name: NUMBER_NAME },
      { name: NUMBER_NAME, required: true },
      { name: NUMBER_NAME },
      { name: NUMBER_NAME }
    ];

    let np: NumberPropertyTester;
    let testNumber = 0;

    beforeEach(function() {
      const options = TEST_OPTIONS[testNumber++];
      np = new NumberPropertyTester(NUMBER_DATA, options);
    });

    it(' 1. validates a default Property (Number)', async function() {
      expect(await np.validate()).to.be.true;
    });

    it(' 2. validates NaN, when required', async function() {
      np.value = NAN_NUMBER_DATA;
      expect(await np.validate()).to.be.false;
      expect(np.getErrors()[0].code).to.equal(
        ValidatorErrorCodes.RequiredAndEmpty
      );
    });

    it(' 3. validates NaN, when not required', async function() {
      np.value = NAN_NUMBER_DATA;
      expect(await np.validate()).to.be.true;
    });

    it(' 4. uses valueOf to add two GenericNumberPropertyTester objects together', function() {
      np.value = FIRST_HALF_NUMBER_DATA;
      const otherNp = new NumberPropertyTester(SECOND_HALF_NUMBER_DATA, {
        name: 'Test Number #2'
      });
      // @ts-ignore: allow objects to be added together
      const result: number = np + otherNp;
      expect(result).to.equal(NUMBER_DATA);
    });
  });

  describe('Testing validation of the class as a Boolean', function() {
    const BOOLEAN_DATA = true;
    const BOOLEAN_NAME = 'Test Boolean';
    const NEW_BOOLEAN_DATA = false;

    const TEST_OPTIONS = [
      { name: BOOLEAN_NAME },
      { name: BOOLEAN_NAME, required: true },
      { name: BOOLEAN_NAME }
    ];

    let bp: BooleanPropertyTester;
    let testNumber = 0;

    beforeEach(function() {
      const options = TEST_OPTIONS[testNumber++];
      bp = new BooleanPropertyTester(BOOLEAN_DATA, options);
    });

    it(' 1. validates a default Property (Boolean)', async function() {
      expect(await bp.validate()).to.be.true;
    });

    // This may seem strange but effectively if you actually
    // create a boolean property and require a value AND that value
    // is false THEN the validate method will return false. The actual
    // decendant class BooleanProperty temporarily sets the required option
    // to false when calling the super.validate to ensure this wacky but
    // valid logic doesn't come and bite you.
    it(' 2. validates false, when required', async function() {
      bp.value = NEW_BOOLEAN_DATA;
      expect(await bp.validate()).to.be.false;
      expect(bp.getErrors()[0].code).to.equal(
        ValidatorErrorCodes.RequiredAndEmpty
      );
    });

    // Conversely to the above test, a boolean property should
    // ALWAYS be valid since a boolean value only has two values
    // and we do not allow undefined or null to be set as a value
    // within these properties.
    it(' 3. validates false, when not required', async function() {
      bp.value = NEW_BOOLEAN_DATA;
      expect(await bp.validate()).to.be.true;
    });
  });
});
