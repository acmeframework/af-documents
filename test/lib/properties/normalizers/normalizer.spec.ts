import "mocha";

import { expect } from "chai";

import {
  DEFAULT_NORMALIZER_NAME,
  Normalizer,
  NormalizerOptions,
  Property,
} from "../../../../src/lib";

class StringNormalizerTester extends Normalizer<string, NormalizerOptions> {
  protected _normalize(value: string): string {
    return value;
  }
}

describe("Normalizer class", function () {
  const NORMALIZER_NAME = "Test Normalizer";
  const STRING_DATA = "Hello World";

  describe("Test the constructor and options", function () {
    it("tests construction of the object with options to test all paths", function () {
      expect(
        new StringNormalizerTester({ name: NORMALIZER_NAME })
      ).to.be.an.instanceof(StringNormalizerTester);
      expect(new StringNormalizerTester(undefined)).to.be.an.instanceof(
        StringNormalizerTester
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(new StringNormalizerTester(null)).to.be.an.instanceof(
        StringNormalizerTester
      );

      expect(new StringNormalizerTester({ name: "" })).to.be.an.instanceof(
        StringNormalizerTester
      );

      const gp = new Property<string>(STRING_DATA, { name: NORMALIZER_NAME });
      expect(new StringNormalizerTester({ parent: gp })).to.be.an.instanceof(
        StringNormalizerTester
      );
    });

    function testPropertyOption(
      loadOptions: NormalizerOptions,
      testOptions: NormalizerOptions
    ): void {
      const snt = new StringNormalizerTester(loadOptions);
      const snto = snt.getOptions();
      expect(snto).to.deep.equal(testOptions);
    }

    it("ensures all options have valid values", function () {
      const loadOptions: NormalizerOptions = {
        name: NORMALIZER_NAME,
      };

      // All defaults (displayName = name by default)
      const testOptions: NormalizerOptions = {
        displayName: NORMALIZER_NAME,
        name: NORMALIZER_NAME,
      };

      // Test defaults
      testPropertyOption(loadOptions, testOptions);

      loadOptions.displayName = "My Test Normalizer";
      testOptions.displayName = "My Test Normalizer";
      testPropertyOption(loadOptions, testOptions);
    });
  });

  describe("Testing functionality of the class as a string", function () {
    const TEST_OPTIONS = [{ name: NORMALIZER_NAME }, {}];

    let snt: StringNormalizerTester;
    let testNumber = 0;

    beforeEach(function () {
      const options = TEST_OPTIONS[testNumber++];
      snt = new StringNormalizerTester(options);
    });

    it("validates a default Normalizer (String)", function () {
      expect(snt.normalize(STRING_DATA)).to.equal(STRING_DATA);

      // And again for coverage of the caching mechanism
      expect(snt.normalize(STRING_DATA)).to.equal(STRING_DATA);
    });

    it("validates that the object gets a default name", function () {
      const options = snt.getOptions();
      expect(options.name).to.equal(
        DEFAULT_NORMALIZER_NAME + "_" + Normalizer.getNormalizerCount()
      );
    });
  });
});
