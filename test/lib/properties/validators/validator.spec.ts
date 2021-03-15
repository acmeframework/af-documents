import 'mocha';

import { isEmpty, isNumber, isUsable } from 'af-conditionals';
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import util = require('util');

import {
  DEFAULT_VALIDATOR_NAME,
  Property,
  Validator,
  VALIDATOR_ENRICHED_DATA_EVENT,
  ValidatorEnrichedDataEvent,
  ValidatorErrorCodes,
  ValidatorOptions,
} from '../../../../src/lib';

const setTimeoutPromise = util.promisify(setTimeout);

chai.use(chaiAsPromised);
const expect = chai.expect;

// NOTE: The following class are not intended to provide REAL validation. Only validation,
// that exercises the methods of the class.

interface PropertyValidatorTesterOptions extends ValidatorOptions {
  delayResponse?: boolean;
}

abstract class ValidatorTester<T> extends Validator<
  T,
  PropertyValidatorTesterOptions
> {
  protected abstract testValue(value: T): boolean;

  protected async _validate(value: T): Promise<boolean> {
    if (this.options.delayResponse) {
      await setTimeoutPromise(200);
    }
    const valid = this.testValue(value);
    if (!valid) {
      if (!isEmpty(value)) {
        this.addInvalidError(['Somethings is wrong, very, wrong!']);
      } else {
        this.addEmptyError(["I ain't got nothing!"]);
      }
    }
    return Promise.resolve(valid);
  }

  protected _validateOptions(newOptions: PropertyValidatorTesterOptions): void {
    super._validateOptions(newOptions);

    if (!isUsable(this.options.delayResponse)) {
      this.options.delayResponse = false;
    }
  }
}

class StringValidatorTester extends ValidatorTester<string> {
  protected testValue(value: string): boolean {
    // Test 3 different cases...
    return isUsable(value) && !isEmpty(value) && value.length < 80;
  }
}

// This is used for coverage testing
class StringValidatorEnrichmentTester extends ValidatorTester<string> {
  protected testValue(value: string): boolean {
    const enrichedData = {
      firstThree: 'Hel',
    };

    this.emitEnrichedData(enrichedData, value);
    return isUsable(value);
  }
}

class NumberValidatorTester extends ValidatorTester<number> {
  protected testValue(value: number): boolean {
    return (
      isNumber(value) &&
      ((this.options.required && !isNaN(value)) || !this.options.required)
    );
  }
}

class BooleanValidatorTester extends ValidatorTester<boolean> {
  protected testValue(value: boolean): boolean {
    return value || (!value && !this.options.required);
  }
}

describe('Validator class', function () {
  const VALIDATOR_NAME = 'Test Validator';
  const STRING_DATA = 'Hello World';

  describe('Test the construction and options', function () {
    it('tests construction of the object with options to test all paths', function () {
      expect(
        new StringValidatorTester({ name: VALIDATOR_NAME })
      ).to.be.an.instanceof(StringValidatorTester);

      expect(new StringValidatorTester(undefined)).to.be.an.instanceof(
        StringValidatorTester
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(new StringValidatorTester(null)).to.be.an.instanceof(
        StringValidatorTester
      );

      expect(new StringValidatorTester({ name: '' })).to.be.an.instanceof(
        StringValidatorTester
      );

      const gp = new Property<string>(STRING_DATA, { name: VALIDATOR_NAME });
      expect(new StringValidatorTester({ parent: gp })).to.be.an.instanceof(
        StringValidatorTester
      );

      expect(
        new StringValidatorTester({ parent: gp, required: false })
      ).to.be.an.instanceof(StringValidatorTester);
    });

    function testPropertyOption(
      loadOptions: PropertyValidatorTesterOptions,
      testOptions: PropertyValidatorTesterOptions
    ): void {
      const svt = new StringValidatorTester(loadOptions);
      const svto = svt.getOptions();
      expect(svto).to.deep.equal(testOptions);
    }

    it('ensures all options have valid values', function () {
      const loadOptions: PropertyValidatorTesterOptions = {
        name: VALIDATOR_NAME,
      };

      // All defaults (displayName = name by default)
      const testOptions: PropertyValidatorTesterOptions = {
        delayResponse: false,
        displayName: VALIDATOR_NAME,
        name: VALIDATOR_NAME,
        required: false,
      };

      // Test defaults
      testPropertyOption(loadOptions, testOptions);

      loadOptions.displayName = 'My Test Property';
      testOptions.displayName = 'My Test Property';
      testPropertyOption(loadOptions, testOptions);
    });
  });

  describe('Testing functionality of the class as a String', function () {
    const EMPTY_STRING_DATA = '';
    const LONG_STRING_DATA =
      '123456789(10)123456789' +
      '(20)123456789(30)123456789(40)123456789(50)' +
      '123456789(60)123456789(70)123456789(80)';

    const TEST_OPTIONS = [
      { name: VALIDATOR_NAME }, // 1
      { name: VALIDATOR_NAME, required: true }, // 2
      { name: VALIDATOR_NAME }, // 3
      { name: VALIDATOR_NAME, delayResponse: true }, // 4
      { name: VALIDATOR_NAME }, // 5
      { name: VALIDATOR_NAME, required: true }, // 6
      {}, // 7
    ];

    let svt: StringValidatorTester;
    let testNumber = 0;

    beforeEach(function () {
      const options = TEST_OPTIONS[testNumber++];
      svt = new StringValidatorTester(options);
    });

    it(' 1. validates a default Validator (String)', async function () {
      expect(await svt.validate(STRING_DATA)).to.be.true;

      // this is for coverage and should simply return
      expect(await svt.validate(STRING_DATA)).to.be.true;
    });

    it(' 2. tests if the data is empty, required is true', async function () {
      expect(await svt.validate(EMPTY_STRING_DATA)).to.be.false;
      expect(svt.getErrors()[0].code).to.be.equal(
        ValidatorErrorCodes.RequiredAndEmpty
      );
    });

    it(' 3. tests if the data is empty, required is false', async function () {
      expect(await svt.validate(EMPTY_STRING_DATA)).to.be.false;
      expect(svt.getErrors()[0].code).to.be.equal(ValidatorErrorCodes.Empty);
    });

    it(
      ' 4. tests if the data is empty, required is false, validation ' +
        'is delayed 200ms',
      async function () {
        async function firstTest() {
          expect(await svt.validate(EMPTY_STRING_DATA)).to.be.false;
          expect(svt.getErrors()[0].code).to.be.equal(
            ValidatorErrorCodes.Empty
          );
        }

        async function secondTest() {
          // We only put this test in the loop SO we can get coverages
          // of the isValidating method
          try {
            let i = 0;
            while (svt.isValidating()) {
              i++;
              if (i === 1) {
                expect(await svt.validate(EMPTY_STRING_DATA)).to.be.true; // This is definitely wrong
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

    it(
      ' 5. tests isValueAllowed and reset and addInvalidError for ' +
        'coverage.',
      async function () {
        expect(svt.isValueAllowed(LONG_STRING_DATA)).to.be.true;
        expect(await svt.validate(LONG_STRING_DATA)).to.be.false;
        expect(svt.getErrors()[0].code).to.be.equal(
          ValidatorErrorCodes.Invalid
        );

        svt.reset();
        expect(svt.getErrors().length).to.equal(0);
      }
    );

    it(' 6. tests isValueAllowed while the value is required.', async function () {
      expect(await svt.validate(LONG_STRING_DATA)).to.be.false;
      expect(svt.getErrors()[0].code).to.be.equal(
        ValidatorErrorCodes.RequiredAndInvalid
      );
    });

    it(' 7. validates that the object gets a default name', function () {
      const options = svt.getOptions();
      expect(options.name).to.equal(
        DEFAULT_VALIDATOR_NAME + '_' + Validator.getValidatorCount()
      );
    });
  });

  describe('Testing validation of the class with data enrichment', function () {
    const STRING_DATA_FIRST_THREE = 'Hel';
    const testEvent: ValidatorEnrichedDataEvent<string> = {
      context: undefined,
      displayName: VALIDATOR_NAME,
      enrichedData: {
        firstThree: STRING_DATA_FIRST_THREE,
      },
      name: VALIDATOR_NAME,
      value: STRING_DATA,
    };

    it('tests that validate emits the first 3 characters of the data', async function () {
      const gsvet = new StringValidatorEnrichmentTester({
        name: VALIDATOR_NAME,
      });
      let enrichedData: any;
      gsvet.on(VALIDATOR_ENRICHED_DATA_EVENT, (event) => {
        enrichedData = event;
      });

      testEvent.context = gsvet;
      expect(await gsvet.validate(STRING_DATA)).to.be.true;
      expect(enrichedData).to.deep.equal(testEvent);
    });
  });

  describe('Testing validation of the class as a Number', function () {
    const NUMBER_DATA = 102696;
    const NAN_NUMBER_DATA = NaN;

    const TEST_OPTIONS = [
      { name: VALIDATOR_NAME },
      { name: VALIDATOR_NAME, required: true },
      { name: VALIDATOR_NAME },
    ];

    let nvt: NumberValidatorTester;
    let testNumber = 0;

    beforeEach(function () {
      const options = TEST_OPTIONS[testNumber++];
      nvt = new NumberValidatorTester(options);
    });

    it('validates a default Validator (Number)', async function () {
      expect(await nvt.validate(NUMBER_DATA)).to.be.true;
    });

    it('validates NaN, when required', async function () {
      expect(await nvt.validate(NAN_NUMBER_DATA)).to.be.false;
      expect(nvt.getErrors()[0].code).to.equal(
        ValidatorErrorCodes.RequiredAndEmpty
      );
    });

    it('validates NaN, when not required', async function () {
      expect(await nvt.validate(NAN_NUMBER_DATA)).to.be.true;
    });
  });

  describe('Testing validation of the class as a Boolean', function () {
    const BOOLEAN_DATA = true;
    const NEW_BOOLEAN_DATA = false;

    const TEST_OPTIONS = [
      { name: VALIDATOR_NAME },
      { name: VALIDATOR_NAME, required: true },
      { name: VALIDATOR_NAME },
    ];

    let bvt: BooleanValidatorTester;
    let testNumber = 0;

    beforeEach(function () {
      const options = TEST_OPTIONS[testNumber++];
      bvt = new BooleanValidatorTester(options);
    });

    it('validates a default Validator (Boolean)', async function () {
      expect(await bvt.validate(BOOLEAN_DATA)).to.be.true;
    });

    // This may seem strange but effectively if you actually
    // create a boolean property and require a value AND that value
    // is false THEN the isValid method will return false. The actual
    // descendant class BooleanProperty temporarily sets the required option
    // to false when calling the super.isValid to ensure this wacky but
    // valid logic doesn't come and bite you.
    it('validates false, when required', async function () {
      expect(await bvt.validate(NEW_BOOLEAN_DATA)).to.be.false;
      expect(bvt.getErrors()[0].code).to.equal(
        ValidatorErrorCodes.RequiredAndEmpty
      );
    });

    // Conversely to the above test, a boolean property should
    // ALWAYS be valid since a boolean value only has two values
    // and we do not allow undefined or null to be set as a value
    // within these properties.
    it('validates false, when not required', async function () {
      expect(await bvt.validate(NEW_BOOLEAN_DATA)).to.be.true;
    });
  });
});
