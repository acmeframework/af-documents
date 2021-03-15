import 'mocha';

import { expect } from 'chai';

import {
  DEFAULT_INVALID_IF_NOT_REQUIRED_AND_EMPTY,
  DEFAULT_REQUIRED,
  RequiredValidator,
  RequiredValidatorOptions,
  StringProperty,
  ValidatorErrorCodes,
} from '../../../../src/lib';

describe('RequiredValidator class', function () {
  const VALIDATOR_NAME = 'Test Validator';
  const STRING_DATA = 'Hello World';

  describe('Test the construction and options', function () {
    it('tests construction of the object with options to test all paths', function () {
      expect(
        new RequiredValidator<string>({ name: VALIDATOR_NAME })
      ).to.be.an.instanceof(RequiredValidator);

      const sp = new StringProperty(STRING_DATA, {
        invalidIfNotRequiredAndEmpty: true,
        name: VALIDATOR_NAME,
      });
      expect(
        new RequiredValidator<string>({ parent: sp })
      ).to.be.an.instanceof(RequiredValidator);
    });

    function testPropertyOption(
      loadOptions: RequiredValidatorOptions,
      testOptions: RequiredValidatorOptions
    ): void {
      const rv = new RequiredValidator(loadOptions);
      const rvo = rv.getOptions();
      expect(rvo).to.deep.equal(testOptions);
    }

    it('ensures all options have valid values', function () {
      const loadOptions: RequiredValidatorOptions = {
        name: VALIDATOR_NAME,
      };

      // All defaults (displayName = name by default)
      const testOptions: RequiredValidatorOptions = {
        displayName: VALIDATOR_NAME,
        invalidIfNotRequiredAndEmpty: DEFAULT_INVALID_IF_NOT_REQUIRED_AND_EMPTY,
        name: VALIDATOR_NAME,
        required: DEFAULT_REQUIRED,
      };

      // Test all defaults
      testPropertyOption(loadOptions, testOptions);
    });
  });

  describe('Testing functionality of the class', function () {
    const EMPTY_STRING_DATA = '';

    const TEST_OPTIONS = [
      { name: VALIDATOR_NAME },
      { name: VALIDATOR_NAME, required: true },
      { invalidIfNotRequiredAndEmpty: true, name: VALIDATOR_NAME },
    ];

    let rv: RequiredValidator<string>;
    let testNumber = 0;

    beforeEach(function () {
      const options = TEST_OPTIONS[testNumber++];
      rv = new RequiredValidator<string>(options);
    });

    it('validates a default RequiredValidator', async function () {
      expect(await rv.validate(STRING_DATA)).to.be.true;
      expect(await rv.validate(EMPTY_STRING_DATA)).to.be.true;
    });

    it('tests if an empty string throws an error when required', async function () {
      expect(await rv.validate(STRING_DATA)).to.be.true;
      expect(await rv.validate(EMPTY_STRING_DATA)).to.be.false;
      expect(rv.getErrors()[0].code).to.equal(
        ValidatorErrorCodes.RequiredAndEmpty
      );
    });

    it(
      'tests if an empty string throws an error when ' +
        'invalidIfNotRequiredAndEmpty is true',
      async function () {
        expect(await rv.validate(STRING_DATA)).to.be.true;
        expect(await rv.validate(EMPTY_STRING_DATA)).to.be.false;
        expect(rv.getErrors()[0].code).to.equal(ValidatorErrorCodes.Empty);
      }
    );
  });
});
