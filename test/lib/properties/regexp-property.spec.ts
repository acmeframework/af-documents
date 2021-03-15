import 'mocha';

import { expect } from 'chai';

import {
  DEFAULT_ENTITY_OPTIONS,
  DEFAULT_PROPERTY_OPTIONS,
  DEFAULT_REGEXP_PROPERTY_NAME,
  DEFAULT_REGEXP_PROPERTY_OPTIONS,
  DEFAULT_STRING_PROPERTY_OPTIONS,
  RegExpProperty,
  regexpPropertyFactory,
  RegExpPropertyOptions,
} from '../../../src/lib';

describe('RegExpProperty class', function () {
  const PROPERTY_NAME = 'RegExp Property';
  const REGEXP_DATA = 'Hello World';

  describe('Test the factory method', function () {
    const drepo = {
      ...DEFAULT_ENTITY_OPTIONS,
      ...DEFAULT_PROPERTY_OPTIONS,
      ...DEFAULT_STRING_PROPERTY_OPTIONS,
      ...DEFAULT_REGEXP_PROPERTY_OPTIONS,
    };
    let rep: RegExpProperty;

    function testOptions() {
      const repo = rep.getOptions();
      expect(repo).to.deep.equal(drepo);
    }

    it('creates a RegExpProperty with all defaults', function () {
      rep = regexpPropertyFactory(REGEXP_DATA);
      expect(rep).to.be.an.instanceof(RegExpProperty);

      const rec = RegExpProperty.getPropertyCount();
      const dn = DEFAULT_REGEXP_PROPERTY_NAME + '_' + rec;
      drepo.name = dn;
      drepo.displayName = dn;
      testOptions();
    });

    it('creates a RegExpProperty with a supplied name', function () {
      rep = regexpPropertyFactory(REGEXP_DATA, PROPERTY_NAME);
      expect(rep).to.be.an.instanceof(RegExpProperty);

      drepo.name = PROPERTY_NAME;
      drepo.displayName = PROPERTY_NAME;
      testOptions();
    });

    it('creates a RegExpProperty with options', function () {
      rep = regexpPropertyFactory(
        REGEXP_DATA,
        undefined,
        undefined,
        undefined,
        drepo
      );
      expect(rep).to.be.an.instanceof(RegExpProperty);
    });

    it('creates a RegExpProperty with no mask specified', function () {
      rep = new RegExpProperty(REGEXP_DATA, {
        name: PROPERTY_NAME,
      } as RegExpPropertyOptions);
      expect(rep).to.be.an.instanceof(RegExpProperty);
    });
  });
});
