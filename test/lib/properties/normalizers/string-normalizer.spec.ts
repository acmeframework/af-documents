import "mocha";

import { expect } from "chai";

import {
  DEFAULT_STRING_NORMALIZE_TO_LOWER,
  DEFAULT_STRING_NORMALIZE_TO_UPPER,
  DEFAULT_STRING_TRIM_LEFT,
  DEFAULT_STRING_TRIM_RIGHT,
  StringNormalizer,
  StringNormalizerOptions,
  StringProperty,
  StringPropertyOptions,
} from "../../../../src/lib";

describe("StringNormalizer class", function () {
  const NORMALIZER_NAME = "Test Normalizer";
  const STRING_DATA = "   Hello World   ";

  describe("Test the constructor and options", function () {
    it("tests construction of the object with options to test all paths", function () {
      expect(
        new StringNormalizer({ name: NORMALIZER_NAME })
      ).to.be.an.instanceof(StringNormalizer);

      expect(new StringNormalizer(undefined)).to.be.an.instanceof(
        StringNormalizer
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(new StringNormalizer(null)).to.be.an.instanceof(StringNormalizer);

      expect(new StringNormalizer({ name: "" })).to.be.an.instanceof(
        StringNormalizer
      );

      expect(function () {
        const sn = new StringNormalizer({
          normalizeToLower: true,
          normalizeToUpper: true,
        });
        console.log("SN = " + JSON.stringify(sn.getOptions()));
      }).to.throw(TypeError);

      const spo: StringPropertyOptions = {
        name: NORMALIZER_NAME,
        normalizeToLower: true,
        trimLeft: true,
        trimRight: true,
      };

      let gp = new StringProperty(STRING_DATA, spo);
      expect(new StringNormalizer({ parent: gp })).to.be.an.instanceof(
        StringNormalizer
      );

      spo.normalizeToLower = false;
      spo.normalizeToUpper = true;
      gp = new StringProperty(STRING_DATA, spo);
      expect(new StringNormalizer({ parent: gp })).to.be.an.instanceof(
        StringNormalizer
      );
    });

    function testPropertyOption(
      loadOptions: StringNormalizerOptions,
      testOptions: StringNormalizerOptions
    ): void {
      const sn = new StringNormalizer(loadOptions);
      const sno = sn.getOptions();
      expect(sno).to.deep.equal(testOptions);
    }

    it("ensures all options have valid values", function () {
      const loadOptions: StringNormalizerOptions = {
        name: NORMALIZER_NAME,
      };

      // All defaults (displayName = name by default)
      const testOptions: StringNormalizerOptions = {
        displayName: NORMALIZER_NAME,
        name: NORMALIZER_NAME,
        normalizeToLower: DEFAULT_STRING_NORMALIZE_TO_LOWER,
        normalizeToUpper: DEFAULT_STRING_NORMALIZE_TO_UPPER,
        trimLeft: DEFAULT_STRING_TRIM_LEFT,
        trimRight: DEFAULT_STRING_TRIM_RIGHT,
      };

      // Test defaults
      testPropertyOption(loadOptions, testOptions);

      loadOptions.normalizeToLower = true;
      testOptions.normalizeToLower = true;
      testPropertyOption(loadOptions, testOptions);

      loadOptions.normalizeToLower = DEFAULT_STRING_NORMALIZE_TO_LOWER;
      loadOptions.normalizeToUpper = true;
      testOptions.normalizeToLower = DEFAULT_STRING_NORMALIZE_TO_LOWER;
      testOptions.normalizeToUpper = true;
      testPropertyOption(loadOptions, testOptions);

      loadOptions.trimLeft = true;
      testOptions.trimLeft = true;
      testPropertyOption(loadOptions, testOptions);

      loadOptions.trimRight = true;
      testOptions.trimRight = true;
      testPropertyOption(loadOptions, testOptions);
    });
  });

  describe("Testing functionality of the class as a string", function () {
    const STRING_DATA_DEFAULT = "Hello World";
    const STRING_DATA_LOWER = "hello world";
    const STRING_DATA_UPPER = "HELLO WORLD";
    const STRING_DATA_TRIMLEFT = "Hello World   ";
    const STRING_DATA_TRIMRIGHT = "   Hello World";

    const TEST_OPTIONS = [
      {},
      { normalizeToLower: true },
      { normalizeToUpper: true },
      { trimRight: false },
      { trimLeft: false },
    ];

    let sn: StringNormalizer;
    let testNumber = 0;

    beforeEach(function () {
      const options = TEST_OPTIONS[testNumber++];
      sn = new StringNormalizer(options);
    });

    it("validates a default StringNormalizer", function () {
      expect(sn.normalize(STRING_DATA)).to.equal(STRING_DATA_DEFAULT);
    });

    it("validates normalization to lower case", function () {
      expect(sn.normalize(STRING_DATA)).to.equal(STRING_DATA_LOWER);
    });

    it("validates normalization to upper case", function () {
      expect(sn.normalize(STRING_DATA)).to.equal(STRING_DATA_UPPER);
    });

    it("validates normalization trim left", function () {
      expect(sn.normalize(STRING_DATA)).to.equal(STRING_DATA_TRIMLEFT);
    });

    it("validates normalization trim right", function () {
      expect(sn.normalize(STRING_DATA)).to.equal(STRING_DATA_TRIMRIGHT);
    });
  });
});
