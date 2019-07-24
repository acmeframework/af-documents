import 'mocha';

import { expect } from 'chai';

import {
  DEFAULT_NUMBER_BOUNDS,
  DEFAULT_NUMBER_MAX_VALUE,
  DEFAULT_NUMBER_MIN_VALUE,
  DEFAULT_REQUIRED,
  NumberBoundTypes,
  NumberProperty,
  NumberValidator,
  NumberValidatorOptions,
  ValidatorErrorCodes,
} from '../../../../src/lib';

// tslint:disable:no-unused-expression no-null-keyword

describe('NumberValidator class', function() {
  const VALIDATOR_NAME = 'Test Validator';
  const NUMBER_DATA = 102696;
  const SMALL_NUMBER_DATA = 5;
  const LARGE_NUMBER_DATA = Infinity;

  const MAXVALUE_TEST = 9000;
  const MINVALUE_TEST = 10000;
  const MAXMINVALUE_OFF = 0;

  describe('Test the construction and options', function() {
    it('throws an Error or a TypeError during construction', function() {
      // maxValue cannot be a lesser value than minValue
      expect(function() {
        new NumberValidator({
          maxValue: MAXVALUE_TEST,
          minValue: MINVALUE_TEST,
          name: VALIDATOR_NAME
        });
      }).to.throw(RangeError);
    });

    // Regression
    it(
      'ensure minValue set with maxValue 0 does not throw an error' +
        '(regression)',
      function() {
        expect(function() {
          new NumberValidator({
            maxValue: MAXMINVALUE_OFF,
            minValue: MINVALUE_TEST,
            name: VALIDATOR_NAME
          });
        }).to.not.throw();
      }
    );

    it('ensure minValue === maxValue does not throw an error (regression)', function() {
      expect(function() {
        new NumberValidator({
          maxValue: NUMBER_DATA,
          minValue: NUMBER_DATA,
          name: VALIDATOR_NAME
        });
      }).to.not.throw();
    });

    it('ensure minValue < Number.MIN_SAFE_INTEGER throws an error', function() {
      expect(function() {
        new NumberValidator({
          maxValue: DEFAULT_NUMBER_MAX_VALUE,
          minValue: -LARGE_NUMBER_DATA,
          name: VALIDATOR_NAME,
          numberBounds: NumberBoundTypes.max_safe_integer
        });
      }).to.throw(RangeError);
    });

    it('ensure maxValue > Number.MAX_SAFE_INTEGER throws an error', function() {
      expect(function() {
        new NumberValidator({
          maxValue: LARGE_NUMBER_DATA,
          minValue: DEFAULT_NUMBER_MIN_VALUE,
          name: VALIDATOR_NAME,
          numberBounds: NumberBoundTypes.max_safe_integer
        });
      }).to.throw(RangeError);
    });

    it('pulls options from the parent', function() {
      const np = new NumberProperty(NUMBER_DATA, { name: VALIDATOR_NAME });
      expect(function() {
        new NumberValidator({ parent: np });
      }).to.not.throw();
    });

    function testPropertyOption(
      loadOptions: NumberValidatorOptions,
      testOptions: NumberValidatorOptions
    ): void {
      const nv = new NumberValidator(loadOptions);
      const nvo = nv.getOptions();

      // Funky process in that if options.maxValue and/or
      // options.minValue are set to +/-Infinity it is reported as null.
      // This stringify/parse imitates this process as well.
      const tpo = JSON.parse(JSON.stringify(testOptions));
      expect(nvo).to.deep.equal(tpo);
    }

    it('ensures all options have valid values', function() {
      const loadOptions: NumberValidatorOptions = {
        name: VALIDATOR_NAME
      };

      // All defaults (displayName = name by default)
      const testOptions: NumberValidatorOptions = {
        displayName: VALIDATOR_NAME,
        maxValue: DEFAULT_NUMBER_MAX_VALUE,
        minValue: DEFAULT_NUMBER_MIN_VALUE,
        name: VALIDATOR_NAME,
        numberBounds: DEFAULT_NUMBER_BOUNDS,
        required: DEFAULT_REQUIRED
      };

      loadOptions.numberBounds = NumberBoundTypes.infinity;
      testOptions.numberBounds = NumberBoundTypes.infinity;
      testOptions.maxValue = Number.POSITIVE_INFINITY;
      testOptions.minValue = Number.NEGATIVE_INFINITY;
      testPropertyOption(loadOptions, testOptions);

      // We want NumberBoundTypes.max_safe_integer to continue
      // to be set for the maxValue and minValue tests
      loadOptions.numberBounds = NumberBoundTypes.max_safe_integer;
      delete loadOptions.maxValue;
      delete loadOptions.minValue;
      testOptions.numberBounds = NumberBoundTypes.max_safe_integer;
      testOptions.maxValue = Number.MAX_SAFE_INTEGER;
      testOptions.minValue = Number.MIN_SAFE_INTEGER;
      testPropertyOption(loadOptions, testOptions);

      loadOptions.maxValue = 30;
      testOptions.maxValue = 30;
      testPropertyOption(loadOptions, testOptions);

      loadOptions.minValue = 5;
      testOptions.minValue = 5;
      testPropertyOption(loadOptions, testOptions);

      // Ensure that we handle present but null options properly
      // @ts-ignore
      loadOptions.maxValue = null;
      // @ts-ignore
      loadOptions.minValue = null;
      testOptions.maxValue = Number.MAX_SAFE_INTEGER;
      testOptions.minValue = Number.MIN_SAFE_INTEGER;
      testPropertyOption(loadOptions, testOptions);

      // Ensure that we handle present but null options properly
      loadOptions.maxValue = undefined;
      loadOptions.minValue = undefined;
      testOptions.maxValue = Number.MAX_SAFE_INTEGER;
      testOptions.minValue = Number.MIN_SAFE_INTEGER;
      testPropertyOption(loadOptions, testOptions);
    });
  });

  describe('Testing functionality of the class', function() {
    const TEST_OPTIONS = [
      { name: VALIDATOR_NAME },
      { name: VALIDATOR_NAME, minValue: 10 },
      { name: VALIDATOR_NAME, required: true, minValue: 10 },
      { name: VALIDATOR_NAME, minValue: -10 },
      { name: VALIDATOR_NAME, maxValue: Number.MAX_SAFE_INTEGER - 2 },
      {
        maxValue: Number.MAX_SAFE_INTEGER - 2,
        name: VALIDATOR_NAME,
        required: true
      },
      { name: VALIDATOR_NAME, maxValue: Number.MIN_SAFE_INTEGER - 2 }
    ];

    let nv: NumberValidator;
    let testNumber = 0;

    beforeEach(function() {
      const options = TEST_OPTIONS[testNumber++];
      nv = new NumberValidator(options);
    });

    it('validates a default NumberValidator', async function() {
      expect(await nv.validate(NUMBER_DATA)).to.be.true;
    });

    it('validates the minValue validation', async function() {
      expect(await nv.validate(NUMBER_DATA)).to.be.true;
      expect(await nv.validate(SMALL_NUMBER_DATA)).to.be.false;
      expect(nv.getErrors()[0].code).to.equal(ValidatorErrorCodes.Invalid);
    });

    it('validates the minValue validation when required', async function() {
      expect(await nv.validate(SMALL_NUMBER_DATA)).to.be.false;
      expect(nv.getErrors()[0].code).to.equal(
        ValidatorErrorCodes.RequiredAndInvalid
      );
    });

    it('validates the minValue validation when minValue is negative', async function() {
      expect(await nv.validate(-NUMBER_DATA)).to.be.false;
      expect(nv.getErrors()[0].code).to.equal(ValidatorErrorCodes.Invalid);
    });

    it('validates the maxValue validation', async function() {
      expect(await nv.validate(LARGE_NUMBER_DATA)).to.be.false;
      expect(nv.getErrors()[0].code).to.equal(ValidatorErrorCodes.Invalid);
    });

    it('validates the maxValue validation when required', async function() {
      expect(await nv.validate(LARGE_NUMBER_DATA)).to.be.false;
      expect(nv.getErrors()[0].code).to.equal(
        ValidatorErrorCodes.RequiredAndInvalid
      );
    });
    it('validates the maxValue validation when maxValue is negative', async function() {
      expect(await nv.validate(NUMBER_DATA)).to.be.false;
      expect(nv.getErrors()[0].code).to.equal(ValidatorErrorCodes.Invalid);

      expect(await nv.validate(-LARGE_NUMBER_DATA)).to.be.true;
    });
  });
});
