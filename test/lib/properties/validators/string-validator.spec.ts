import 'mocha';

import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');

import {
  DEFAULT_REQUIRED,
  DEFAULT_STRING_MAX_LENGTH,
  DEFAULT_STRING_MIN_LENGTH,
  StringProperty,
  StringValidator,
  StringValidatorOptions,
  ValidatorErrorCodes,
} from '../../../../src/lib';

chai.use(chaiAsPromised);
const expect = chai.expect;

// tslint:disable:no-unused-expression no-null-keyword

describe('StringValidator class', function() {
  const VALIDATOR_NAME = 'Test Validator';
  const STRING_DATA = 'Hello World';

  describe('Test the construction and options', function() {
    it('tests construction of the object with options to test all paths', function() {
      expect(new StringValidator({ name: VALIDATOR_NAME })).to.be.an.instanceof(
        StringValidator
      );

      expect(new StringValidator(undefined)).to.be.an.instanceof(
        StringValidator
      );

      // @ts-ignore
      expect(new StringValidator(null)).to.be.an.instanceof(StringValidator);

      expect(new StringValidator({ name: '' })).to.be.an.instanceof(
        StringValidator
      );

      const gp = new StringProperty(STRING_DATA, { name: VALIDATOR_NAME });
      expect(new StringValidator({ parent: gp })).to.be.an.instanceof(
        StringValidator
      );

      expect(function() {
        new StringValidator({
          maxLength: 20,
          minLength: 30,
          name: VALIDATOR_NAME
        });
      }).to.throw(TypeError);
    });

    function testPropertyOption(
      loadOptions: StringValidatorOptions,
      testOptions: StringValidatorOptions
    ): void {
      const sv = new StringValidator(loadOptions);
      const svo = sv.getOptions();
      expect(svo).to.deep.equal(testOptions);
    }

    it('ensures all options have valid values', function() {
      const loadOptions: StringValidatorOptions = {
        name: VALIDATOR_NAME
      };

      // All defaults (displayName = name by default)
      const testOptions: StringValidatorOptions = {
        displayName: VALIDATOR_NAME,
        maxLength: DEFAULT_STRING_MAX_LENGTH,
        minLength: DEFAULT_STRING_MIN_LENGTH,
        name: VALIDATOR_NAME,
        required: DEFAULT_REQUIRED
      };

      // Test all defaults
      testPropertyOption(loadOptions, testOptions);

      loadOptions.displayName = 'My Test Property';
      testOptions.displayName = 'My Test Property';
      testPropertyOption(loadOptions, testOptions);

      loadOptions.maxLength = 80;
      testOptions.maxLength = 80;
      testPropertyOption(loadOptions, testOptions);

      loadOptions.minLength = 5;
      testOptions.minLength = 5;
      testPropertyOption(loadOptions, testOptions);
    });
  });

  describe('Testing functionality of the class', function() {
    const EMPTY_STRING_DATA = '';

    const TEST_OPTIONS = [
      { name: VALIDATOR_NAME },
      { name: VALIDATOR_NAME, minLength: 5 },
      { name: VALIDATOR_NAME, minLength: 15 },
      { name: VALIDATOR_NAME, minLength: 15, required: true },
      { name: VALIDATOR_NAME, maxLength: 20 },
      { name: VALIDATOR_NAME, maxLength: 10 }
    ];

    let sv: StringValidator;
    let testNumber = 0;

    beforeEach(function() {
      const options = TEST_OPTIONS[testNumber++];
      sv = new StringValidator(options);
    });

    it('validates a default StringValidator', async function() {
      expect(await sv.validate(STRING_DATA)).to.be.true;
    });

    it(
      'tests if the data is greater than the minLength when ' +
        'minLength = 5 (true)',
      async function() {
        expect(await sv.validate(STRING_DATA)).to.be.true;
      }
    );

    it(
      'tests if the data is greater than the minLength when ' +
        'minLength = 15 (false)',
      async function() {
        expect(await sv.validate(STRING_DATA)).to.be.false;
        expect(sv.getErrors()[0].code).to.be.equal(ValidatorErrorCodes.Invalid);

        expect(await sv.validate(EMPTY_STRING_DATA)).to.be.true;
      }
    );

    it(
      'tests if the data is greater than the minLength when minLength' +
        ' = 15 (false), and required',
      async function() {
        expect(await sv.validate(STRING_DATA)).to.be.false;
        expect(sv.getErrors()[0].code).to.be.equal(
          ValidatorErrorCodes.RequiredAndInvalid
        );
      }
    );

    it(
      'tests if the data is greater than the maxLength when ' +
        'maxLength = 20 (true)',
      async function() {
        expect(await sv.validate(STRING_DATA)).to.be.true;
      }
    );

    it(
      'tests if the data is greater than the maxLength when ' +
        'maxLength = 10 (false)',
      async function() {
        expect(await sv.validate(STRING_DATA)).to.be.false;
        expect(sv.getErrors()[0].code).to.be.equal(ValidatorErrorCodes.Invalid);
      }
    );
  });
});
