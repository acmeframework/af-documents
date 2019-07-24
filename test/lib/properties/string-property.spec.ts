import 'mocha';

import { expect } from 'chai';

import {
  DEFAULT_ENTITY_OPTIONS,
  DEFAULT_PROPERTY_OPTIONS,
  DEFAULT_STRING_PROPERTY_NAME,
  DEFAULT_STRING_PROPERTY_OPTIONS,
  StringProperty,
  stringPropertyFactory,
} from '../../../src/lib';

// tslint:disable:no-unused-expression

describe('StringProperty class', function() {
  const PROPERTY_NAME = 'String Property';
  const STRING_DATA = 'Hello World';

  describe('Test the factory method', function() {
    const dspo = {
      ...DEFAULT_ENTITY_OPTIONS,
      ...DEFAULT_PROPERTY_OPTIONS,
      ...DEFAULT_STRING_PROPERTY_OPTIONS
    };
    // const dspo = cloneDeep(tempAllOptions);
    let sp: StringProperty;

    function testOptions() {
      const spo = sp.getOptions();
      expect(spo).to.deep.equal(dspo);
    }

    it('creates a StringProperty with all defaults', function() {
      sp = stringPropertyFactory(STRING_DATA);
      expect(sp).to.be.an.instanceof(StringProperty);

      const sc = StringProperty.getPropertyCount();
      const dn = DEFAULT_STRING_PROPERTY_NAME + '_' + sc;
      dspo.name = dn;
      dspo.displayName = dn;
      testOptions();
    });

    it('creates a StringProperty with a supplied name', function() {
      sp = stringPropertyFactory(STRING_DATA, PROPERTY_NAME);
      expect(sp).to.be.an.instanceof(StringProperty);

      dspo.name = PROPERTY_NAME;
      dspo.displayName = PROPERTY_NAME;
      testOptions();
    });
  });
});
