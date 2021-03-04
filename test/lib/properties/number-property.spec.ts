import "mocha";

import { expect } from "chai";

import {
  DEFAULT_ENTITY_OPTIONS,
  DEFAULT_NUMBER_PROPERTY_NAME,
  DEFAULT_NUMBER_PROPERTY_OPTION,
  DEFAULT_PROPERTY_OPTIONS,
  NumberProperty,
  numberPropertyFactory,
} from "../../../src/lib";

describe("NumberProperty class", function () {
  const PROPERTY_NAME = "Number Property";
  const NUMBER_DATA = 102696;

  describe("Test the factory method", function () {
    const dnpo = {
      ...DEFAULT_ENTITY_OPTIONS,
      ...DEFAULT_PROPERTY_OPTIONS,
      ...DEFAULT_NUMBER_PROPERTY_OPTION,
    };
    let np: NumberProperty;

    function testOptions() {
      const npo = np.getOptions();
      expect(npo).to.deep.equal(dnpo);
    }

    it("creates a NumberProperty with all defaults", function () {
      np = numberPropertyFactory(NUMBER_DATA);
      expect(np).to.be.an.instanceof(NumberProperty);

      const nc = NumberProperty.getPropertyCount();
      const dn = DEFAULT_NUMBER_PROPERTY_NAME + "_" + nc;
      dnpo.name = dn;
      dnpo.displayName = dn;
      testOptions();
    });

    it("creates a NumberProperty with a supplied name", function () {
      np = numberPropertyFactory(NUMBER_DATA, PROPERTY_NAME);
      expect(np).to.be.an.instanceof(NumberProperty);

      dnpo.name = PROPERTY_NAME;
      dnpo.displayName = PROPERTY_NAME;
      testOptions();
    });
  });
});
