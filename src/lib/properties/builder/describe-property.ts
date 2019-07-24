/**
 * This file is "temporary" storage for meta data about different property
 * types and configurations.
 */
import {
  booleanPropertyFactory,
  DEFAULT_BOOLEAN_PROPERTY_NAME,
} from '../boolean-property';
import { emailPropertyFactory } from '../email-property';
import {
  DEFAULT_EMAIL_MASK,
  DEFAULT_EMAIL_PROPERTY_NAME,
  MAXIMUM_EMAIL_ADDRESS_LEN,
  MINIMUM_EMAIL_ADDRESS_LEN,
} from '../email-property-defs';
import {
  DEFAULT_IMMUTABLE_PROPERTY_NAME,
  ImmutableProperty,
  immutablePropertyFactory,
} from '../immutable-property';
import { numberPropertyFactory } from '../number-property';
import { DEFAULT_NUMBER_PROPERTY_NAME } from '../number-property-defs';
import { Property, PropertyOptions } from '../property';
import {
  regexpPropertyFactory,
  RegExpPropertyOptions,
} from '../regexp-property';
import {
  DEFAULT_REGEXP_MASK,
  DEFAULT_REGEXP_PROPERTY_NAME,
} from '../regexp-property-defs';
import {
  stringPropertyFactory,
  StringPropertyOptions,
} from '../string-property';
import { DEFAULT_STRING_PROPERTY_NAME } from '../string-property-defs';

export type ClassificationName = string;

/**
 * This array holds the different types of property classification names.
 * Which means that these are the allowable property classifications. A
 * classification is a way to group similar property structure to many
 * different names. (ex. Latitude and Longitude are two different values but
 * both are a RegExpProperty).
 *
 * @export
 * @constant propertyClassificationNames
 */
export const propertyClassificationNames: ClassificationName[] = [
  // Regular types
  'boolean',
  'immutable',
  'number',
  'regexp',
  'string',

  // Meta types - meaning they are based upon a regular type
  'email',
  'geohash',
  'ip_address',
  'latitude',
  'longitude',
  'name_first',
  'name_last',
  'name_middle',
  'name_prefix',
  'name_suffix',
  'country',
  'county',
  'zip_code',
  'postal_code',
  'state_province',
  'city',
  'address_line',
  'phone_number',
  'phone_number_extension',
  'date_birth',
  'date_anniversary'
];

export type PropertyMap = Record<string, ClassificationName>;

/**
 * This map provides a simple way to map property names to actual property
 * definitions. This can possibly help is dynamically identifying and using
 * values from unknown sources (ex. retrieve data from an API and process the
 * received JSON object using this map to build a real object.
 *
 * @export
 * @constant propertyAliasMap
 */
export const propertyAliasMap: PropertyMap = {
  address: 'address_line',
  address1: 'address_line',
  address2: 'address_line',
  address3: 'address_line',
  address_line: 'address_line',
  addressline: 'address_line',
  age: 'number',
  anniversary: 'date_anniversary',
  birthdate: 'date_birth',
  birthday: 'date_birth',
  boolean: 'boolean',
  borough: 'city',
  city: 'city',
  count: 'number',
  country: 'country',
  countrycode: 'country',
  county: 'county',
  date_anniversary: 'date_anniversary',
  dateanniversary: 'date_anniversary',
  datebirth: 'date_birth',
  datebirthdate: 'date_birth',
  datebirthday: 'date_birth',
  email: 'email',
  emailaddress: 'email',
  fax: 'phone_number',
  fax_number: 'phone_number',
  faxnumber: 'phone_number',
  first_name: 'name_first',
  firstname: 'name_first',
  immutable: 'immutable',
  ip_address: 'ip_address',
  ipaddress: 'ip_address',
  last_name: 'name_list',
  lastname: 'name_last',
  lat: 'latitude',
  latitude: 'latitude',
  longitude: 'longitude',
  middle_name: 'name_middle',
  middleinitial: 'name_middle',
  middlename: 'name_middle',
  mobile: 'phone_number',
  mobile_number: 'phone_number',
  mobilenumber: 'phone_number',
  name_first: 'name_first',
  name_last: 'name_last',
  name_middle: 'name_middle',
  name_prefix: 'name_prefix',
  name_suffix: 'name_suffix',
  number: 'number',
  phone: 'phone_number',
  phone_number: 'phone_number',
  phone_number_extension: 'phone_number_extention',
  phoneext: 'phone_number_extension',
  phonenumber: 'phone_number',
  phonenumberext: 'phone_number_extension',
  phonenumberextension: 'phone_number_extension',
  postal: 'postal_code',
  postal_code: 'postal_code',
  postalcode: 'postal_code',
  province: 'state_province',
  regexp: 'regexp',
  state: 'state_province',
  state_province: 'state_province',
  stateprovince: 'state_province',
  string: 'string',
  work: 'phone_number',
  work_ext: 'phone_number_extension',
  work_extension: 'phone_number_extension',
  work_fax: 'phone_number',
  work_fax_number: 'phone_number',
  work_number: 'phone_number',
  workext: 'phone_number_extension',
  workextension: 'phone_number_extension',
  workfax: 'phone_number',
  workfaxNumber: 'phone_number',
  worknumber: 'phone_number',
  zip: 'zip_code',
  zip_code: 'zip_code',
  zipcode: 'zip_code'
};

/**
 * Describe how the actual property object should be created and with what
 * defaults (if required) based upon a name.
 *
 * @export
 * @interface PropertyDescription
 */
export interface PropertyDescription {
  classification: string;
  descriptionName: string;
  factory: (...args: any[]) => Property | ImmutableProperty;
  options: PropertyOptions;
}

export type PropertyDescriptionMap = Record<string, PropertyDescription>;

/**
 * Provide a map from a property classification to a property description.
 *
 * @export
 * @constant propertyClassificationMap
 */
export const propertyClassificationMap: PropertyDescriptionMap = {
  address_line: {
    classification: 'address_line',
    descriptionName: 'address_line',
    factory: stringPropertyFactory,
    options: {
      displayName: 'Address',
      maxLength: 255,
      name: 'address_line'
    } as StringPropertyOptions
  },
  boolean: {
    classification: 'boolean',
    descriptionName: 'boolean',
    factory: booleanPropertyFactory,
    options: {
      displayName: 'Boolean',
      name: DEFAULT_BOOLEAN_PROPERTY_NAME,
      required: false
    }
  },
  city: {
    classification: 'city',
    descriptionName: 'City',
    factory: stringPropertyFactory,
    options: {
      displayName: 'City',
      maxLength: 255,
      minLength: 1,
      name: 'city'
    } as StringPropertyOptions
  },
  country: {
    classification: 'country',
    descriptionName: 'Country',
    factory: stringPropertyFactory,
    options: {
      displayName: 'Country',
      maxLength: 255,
      minLength: 1,
      name: 'country'
    } as StringPropertyOptions
  },
  date_anniversary: {
    classification: 'date_anniversary',
    descriptionName: 'Anniversary',
    factory: stringPropertyFactory,
    options: {
      displayName: 'Anniversary',
      maxLength: 10,
      minLength: 6,
      name: 'anniversary'
    } as StringPropertyOptions
  },
  date_birth: {
    classification: 'date_birth',
    descriptionName: 'Birthday',
    factory: stringPropertyFactory,
    options: {
      displayName: 'Birthday',
      maxLength: 10,
      minLength: 6,
      name: 'birthday'
    } as StringPropertyOptions
  },
  email: {
    classification: 'email',
    descriptionName: 'emailAddress',
    factory: emailPropertyFactory,
    options: {
      displayName: 'Email Address',
      mask: DEFAULT_EMAIL_MASK,
      maxLength: MAXIMUM_EMAIL_ADDRESS_LEN,
      minLength: MINIMUM_EMAIL_ADDRESS_LEN,
      name: DEFAULT_EMAIL_PROPERTY_NAME,
      normalizeToLower: true
    } as RegExpPropertyOptions
  },
  geohash: {
    classification: 'geohas',
    descriptionName: 'GeoHash',
    factory: stringPropertyFactory,
    options: {
      displayName: 'GeoHash',
      minLength: 1,
      name: 'geohash'
    } as StringPropertyOptions
  },
  immutable: {
    classification: 'immutable',
    descriptionName: 'immutable',
    factory: immutablePropertyFactory,
    options: {
      displayName: 'Immutable',
      name: DEFAULT_IMMUTABLE_PROPERTY_NAME
    }
  },
  ip_address: {
    classification: 'ip_address',
    descriptionName: 'IP Address',
    factory: regexpPropertyFactory,
    options: {
      displayName: 'IP Address',
      // tslint:disable-next-line:max-line-length
      mask: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
      maxLength: 15,
      minLength: 7,
      name: 'ip_address'
    } as RegExpPropertyOptions
  },
  latitude: {
    classification: 'latitude',
    descriptionName: 'Latitude',
    factory: regexpPropertyFactory,
    options: {
      displayName: 'Latitude',
      mask: /^(\-?\d+(\.\d+)?)$/,
      name: 'latitude'
    } as RegExpPropertyOptions
  },
  longitude: {
    classification: 'longitude',
    descriptionName: 'Longitude',
    factory: regexpPropertyFactory,
    options: {
      displayName: 'Longitude',
      mask: /^(\-?\d+(\.\d+)?)$/,
      name: 'longitude'
    } as RegExpPropertyOptions
  },
  name_first: {
    classification: 'name_first',
    descriptionName: 'First Name',
    factory: stringPropertyFactory,
    options: {
      displayName: 'First Name',
      maxLength: 255,
      minLength: 1,
      name: 'name_first'
    } as StringPropertyOptions
  },
  name_last: {
    classification: 'name_last',
    descriptionName: 'Last Name',
    factory: stringPropertyFactory,
    options: {
      displayName: 'Last Name',
      maxLength: 255,
      minLength: 1,
      name: 'name_last'
    } as StringPropertyOptions
  },
  name_middle: {
    classification: 'name_middle',
    descriptionName: 'Middle Name',
    factory: stringPropertyFactory,
    options: {
      displayName: 'Middle Name',
      maxLength: 255,
      minLength: 1,
      name: 'name_middle'
    } as StringPropertyOptions
  },
  name_prefix: {
    classification: 'name_prefix',
    descriptionName: 'Name Prefix',
    factory: stringPropertyFactory,
    options: {
      displayName: 'Name Prefix',
      maxLength: 255,
      minLength: 1,
      name: 'name_prefix'
    } as StringPropertyOptions
  },
  name_suffix: {
    classification: 'name_suffix',
    descriptionName: 'Name Suffix',
    factory: stringPropertyFactory,
    options: {
      displayName: 'Name Suffix',
      maxLength: 255,
      minLength: 1,
      name: 'name_suffix'
    } as StringPropertyOptions
  },
  number: {
    classification: 'number',
    descriptionName: 'number',
    factory: numberPropertyFactory,
    options: {
      displayName: 'Number',
      name: DEFAULT_NUMBER_PROPERTY_NAME
    }
  },
  phone_number: {
    classification: 'phone_number',
    descriptionName: 'Phone Number',
    factory: stringPropertyFactory,
    options: {
      displayName: 'Phone Number',
      maxLength: 15,
      minLength: 7,
      name: 'phone_number'
    } as StringPropertyOptions
  },
  phone_number_extension: {
    classification: 'phone_number_extension',
    descriptionName: 'Phone Number Extension',
    factory: stringPropertyFactory,
    options: {
      displayName: 'Phone Number Extension',
      maxLength: 10,
      minLength: 1,
      name: 'phone_number_extension'
    } as StringPropertyOptions
  },
  postal_code: {
    classification: 'postal_code',
    descriptionName: 'Postal Code',
    factory: stringPropertyFactory,
    options: {
      displayName: 'Postal Code',
      maxLength: 15,
      minLength: 6,
      name: 'postal_code'
    } as StringPropertyOptions
  },
  regexp: {
    classification: 'regexp',
    descriptionName: 'regexp',
    factory: regexpPropertyFactory,
    options: {
      displayName: 'RegExp',
      mask: DEFAULT_REGEXP_MASK,
      name: DEFAULT_REGEXP_PROPERTY_NAME
    } as RegExpPropertyOptions
  },
  state_province: {
    classification: 'state_province',
    descriptionName: 'State or Province',
    factory: stringPropertyFactory,
    options: {
      displayName: 'State/Province',
      maxLength: 255,
      minLength: 1,
      name: 'state_province'
    } as StringPropertyOptions
  },
  string: {
    classification: 'string',
    descriptionName: 'string',
    factory: stringPropertyFactory,
    options: {
      displayName: 'String',
      minLength: 1,
      name: DEFAULT_STRING_PROPERTY_NAME
    } as StringPropertyOptions
  }
};
