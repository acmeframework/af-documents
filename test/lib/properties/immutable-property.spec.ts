import "mocha";

import { expect } from "chai";

import {
  DEFAULT_IMMUTABLE_PROPERTY_NAME,
  DEFAULT_VALIDATION_STOP_ON_INVALID,
  DEFAULT_VALIDATION_WAIT_INTERVAL,
  DEFAULT_VALIDATION_WAIT_TIMEOUT,
  ImmutableProperty,
  immutablePropertyFactory,
  ImmutablePropertyOptions,
} from "../../../src/lib";

/* eslint-disable @typescript-eslint/ban-ts-comment */

describe("ImmutableProperty class", function () {
  const PROPERTY_NAME = "Immutable Property";

  const STRING_DATA = "Hello World";
  const NUMBER_DATA = 102696;
  const NUMBER_STRING_DATA = "102696";

  const FIRST_HALF_CONST_DATA = "Hello ";
  const SECOND_HALF_CONST_DATA = "World";

  describe("Test the static method getNextPropertyCount", function () {
    it(
      "ensures that successive calls to getNexPropertyCount provides " +
        "sequential results",
      function () {
        let x = ImmutableProperty.getPropertyCount();
        expect(ImmutableProperty.getNextPropertyCount()).to.equal(++x);
        expect(ImmutableProperty.getNextPropertyCount()).to.equal(++x);
        expect(ImmutableProperty.getNextPropertyCount()).to.equal(++x);
      }
    );
  });

  describe("Test the construction and options", function () {
    it("throws a TypeError during construction", function () {
      expect(function () {
        // @ts-ignore
        new ImmutableProperty<string>(undefined, PROPERTY_NAME);
      }).to.throw(TypeError);

      expect(function () {
        // @ts-ignore
        new ImmutableProperty<string>(null, PROPERTY_NAME);
      }).to.throw(TypeError);

      expect(function () {
        // @ts-ignore
        new ImmutableProperty<string>(STRING_DATA, undefined);
      }).to.throw(TypeError);

      expect(function () {
        // @ts-ignore
        new ImmutableProperty<string>(STRING_DATA, null);
      }).to.throw(TypeError);
    });

    it("instantiates a valid ImmutableProperty", function () {
      expect(
        new ImmutableProperty<string>(STRING_DATA, PROPERTY_NAME)
      ).to.be.an.instanceof(ImmutableProperty);
    });
  });

  describe("Test the factory method", function () {
    const dipo: ImmutablePropertyOptions = {
      name: PROPERTY_NAME,
      validationStopOnInvalid: DEFAULT_VALIDATION_STOP_ON_INVALID,
      validationWaitInterval: DEFAULT_VALIDATION_WAIT_INTERVAL,
      validationWaitTimeout: DEFAULT_VALIDATION_WAIT_TIMEOUT,
    };

    let sip: ImmutableProperty<string>;

    function testOptions() {
      const ipo = sip.getOptions();
      expect(ipo).to.deep.equal(dipo);
    }

    it("creates a ImmutableProperty with all defaults", function () {
      sip = immutablePropertyFactory(STRING_DATA);
      expect(sip).to.be.an.instanceof(ImmutableProperty);

      const ic = ImmutableProperty.getPropertyCount();
      const dn = DEFAULT_IMMUTABLE_PROPERTY_NAME + "_" + ic;
      dipo.name = dn;
      dipo.displayName = dn;
      testOptions();
    });

    it("creates a ImmutableProperty with a supplied name", function () {
      sip = immutablePropertyFactory(STRING_DATA, PROPERTY_NAME);
      expect(sip).to.be.an.instanceof(ImmutableProperty);

      dipo.name = PROPERTY_NAME;
      dipo.displayName = PROPERTY_NAME;
      testOptions();
    });
  });

  describe("Testing functionality of the class (as a String)", function () {
    let sip: ImmutableProperty<string>;

    beforeEach(function () {
      sip = new ImmutableProperty(STRING_DATA, PROPERTY_NAME);
    });

    it("validates a default ImmutableProperty", async function () {
      expect(sip.isValidating()).to.be.false;
      expect(await sip.validate()).to.be.true;
      expect(sip.isValid()).to.be.true;
      expect(sip.getErrors().length).to.equal(0);
    });

    it("gets the name of the ImmutableProperty", function () {
      expect(sip.getName()).to.equal(PROPERTY_NAME);
    });

    it("check the isEqual method", function () {
      expect(sip.isEqual(NUMBER_STRING_DATA)).to.be.false;
    });

    it("exercises the normalize workflow", function () {
      // isNormalized will always return true!
      expect(sip.isNormalized()).to.be.true;
      sip.normalize();
      sip.reset(); // Will have no effect
      expect(sip.isNormalized()).to.be.true;
    });

    it("isRequired returns false - always", function () {
      expect(sip.isRequired()).to.be.false;
    });

    it("uses toString to get the string value of ImmutableProperty", function () {
      expect(sip.toString()).to.be.a("string").to.equal(STRING_DATA);
    });

    it("uses valueOf to get the value of the ImmutableProperty", function () {
      expect(sip.valueOf()).to.be.a("string").to.equal(STRING_DATA);
    });

    it(
      "uses valueOf to add two ImmutableProperty<string> objects " + "together",
      function () {
        sip = new ImmutableProperty<string>(
          FIRST_HALF_CONST_DATA,
          PROPERTY_NAME
        );

        const otherSip = new ImmutableProperty<string>(
          SECOND_HALF_CONST_DATA,
          "Test Property #2"
        );

        // @ts-ignore: allow objects to be added together
        const result: string = sip + otherSip;
        expect(result).to.equal(STRING_DATA);
      }
    );
  });

  describe("Testing functionality of the class (as a String)", function () {
    let nip: ImmutableProperty<number>;

    beforeEach(function () {
      nip = new ImmutableProperty(NUMBER_DATA, PROPERTY_NAME);
    });

    it(
      "uses toString on a numeric ImmutableProperty to get the string " +
        "value",
      function () {
        expect(nip.toString()).to.be.a("string").to.equal(NUMBER_STRING_DATA);
      }
    );
  });
});
