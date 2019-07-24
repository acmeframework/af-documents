import 'mocha';

import { expect } from 'chai';

import {
  propertyBuilder,
  PropertyMap,
  RegExpProperty,
  StringProperty,
} from '../../../../src/lib';

// tslint:disable:no-unused-expression

describe('Test the propertyBuilder factory', function() {
  const INVALID_PROPERTY_NAME = 'never_will_be_found';
  const STRING_PROPERTY_NAME = 'firstName';
  const STRING_DATA = 'Michael';
  const EMAIL_PROPERTY_NAME = 'emailAddress';
  const EMAIL_DATA = 'test@example.com';

  it('returned undefined for an invalid property name', function() {
    expect(propertyBuilder(STRING_DATA, INVALID_PROPERTY_NAME)).to.be.undefined;

    // @ts-ignore
    expect(propertyBuilder(STRING_DATA, undefined)).to.be.undefined;
  });

  it('builds a string property', function() {
    expect(
      propertyBuilder(STRING_DATA, STRING_PROPERTY_NAME)
    ).to.be.an.instanceof(StringProperty);
  });

  it('builds a Email property (a masked property)', function() {
    expect(
      propertyBuilder(EMAIL_DATA, EMAIL_PROPERTY_NAME)
    ).to.be.an.instanceof(RegExpProperty);
  });

  it('tests a user supplied aliasMap', function() {
    const myAliasMap: PropertyMap = {
      this_is_silly: 'string'
    };
    const MY_PROPERTY_NAME = 'this_is_silly';

    expect(
      propertyBuilder(STRING_DATA, MY_PROPERTY_NAME, undefined, myAliasMap)
    ).to.be.an.instanceof(StringProperty);

    expect(
      propertyBuilder(STRING_DATA, INVALID_PROPERTY_NAME, undefined, myAliasMap)
    ).to.be.undefined;
  });
});
