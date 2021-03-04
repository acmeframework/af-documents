import "mocha";

import { expect } from "chai";

import {
  DEFAULT_REGEXP_MASK,
  DEFAULT_REQUIRED,
  DEFAULT_STRING_MAX_LENGTH,
  DEFAULT_STRING_MIN_LENGTH,
  RegExpProperty,
  RegExpValidator,
  RegExpValidatorOptions,
  ValidatorErrorCodes,
} from "../../../../src/lib";

describe("RegExpValidator class", function () {
  const VALIDATOR_NAME = "Test String";
  const STRING_DATA = "Hello World";

  describe("Test the construction and options", function () {
    it("tests construction of the object with options to test all paths", function () {
      expect(function () {
        new RegExpValidator({ name: VALIDATOR_NAME });
      }).to.throw(TypeError);

      expect(
        new RegExpValidator({
          mask: DEFAULT_REGEXP_MASK,
          name: VALIDATOR_NAME,
        })
      ).to.be.an.instanceof(RegExpValidator);

      const rp = new RegExpProperty(STRING_DATA, {
        mask: DEFAULT_REGEXP_MASK,
        name: VALIDATOR_NAME,
      });
      expect(new RegExpValidator({ parent: rp })).to.be.an.instanceof(
        RegExpValidator
      );
    });

    function testPropertyOption(
      loadOptions: RegExpValidatorOptions,
      testOptions: RegExpValidatorOptions
    ): void {
      const sp = new RegExpValidator(loadOptions);
      const spo = sp.getOptions();
      const tpo = JSON.parse(JSON.stringify(testOptions));
      expect(spo).to.deep.equal(tpo);
    }

    it("ensures all options have valid values", function () {
      const loadOptions: RegExpValidatorOptions = {
        mask: DEFAULT_REGEXP_MASK,
        name: VALIDATOR_NAME,
      };

      // All defaults (displayName = name by default)
      const testOptions: RegExpValidatorOptions = {
        displayName: VALIDATOR_NAME,
        mask: DEFAULT_REGEXP_MASK,
        maxLength: DEFAULT_STRING_MAX_LENGTH,
        minLength: DEFAULT_STRING_MIN_LENGTH,
        name: VALIDATOR_NAME,
        required: DEFAULT_REQUIRED,
      };

      // Test all defaults
      testPropertyOption(loadOptions, testOptions);
    });
  });

  describe("Testing functionality of the class", function () {
    const EMPTY_STRING_DATA = "";
    const SPECIFIC_REGEXP = /[0-9]{3}-[0-9]{2}-[0-9]{4}/;
    const MATCH_SPECIFIC_REGEXP_STRING = "123-45-6789";

    const TEST_OPTIONS = [
      { mask: DEFAULT_REGEXP_MASK, name: VALIDATOR_NAME },
      { mask: SPECIFIC_REGEXP, name: VALIDATOR_NAME },
    ];

    let rv: RegExpValidator;
    let testNumber = 0;

    beforeEach(function () {
      const options = TEST_OPTIONS[testNumber++];
      rv = new RegExpValidator(options);
    });

    it("validates a default RegExpValidator", async function () {
      expect(await rv.validate(STRING_DATA)).to.be.true;
      expect(await rv.validate(EMPTY_STRING_DATA)).to.be.true;
    });

    it("tests if the string matches a specific RegExp", async function () {
      expect(await rv.validate(STRING_DATA)).to.be.false;
      expect(rv.getErrors()[0].code).to.equal(ValidatorErrorCodes.Invalid);
      expect(await rv.validate(MATCH_SPECIFIC_REGEXP_STRING)).to.be.true;
    });
  });
});
