export const BAD_JSON_OBJECT = '{ name: }';

export const SIMPLE_OBJECT = {
  firstName: 'Michael'
};

export const SIMPLE_JSON_OBJECT = '{ "firstName": "Michael" }';

export const SIMPLE_OBJECT_UNKNOWNFIELD = {
  me: 'Michael Coakley'
};

// const EMPTY_OBJECT = {};

export const BAD_PROPERTY_NAME = 'nope-not-here';
export const AGE_NAME = 'age';
export const AGE_VALUE1 = 48;
export const AGE_VALUE2 = 99;
export const FIRST_NAME_NAME = 'firstName';
export const FIRST_NAME_VALUE1 = 'Michael';
export const FIRST_NAME_VALUE2 = 'Steve';
export const BAD_FIRST_NAME_VALUE =
  '01234567890123456789012345678901234567890123456789' + // 50
  '01234567890123456789012345678901234567890123456789' + // 50
  '01234567890123456789012345678901234567890123456789' + // 50
  '01234567890123456789012345678901234567890123456789' + // 50
  '01234567890123456789012345678901234567890123456789' + // 50
  '01234567890123456789012345678901234567890123456789'; // = 300

export const LAST_NAME_NAME = 'lastName';
export const LAST_NAME_VALUE1 = 'Coakley';
export const LAST_NAME_VALUE2 = 'Smith';
export const ME_NAME = 'me';
export const ME_VALUE1 = 'Michael Coakley';
export const ME_VALUE2 = 'Steve Smith';

export const TEST_OBJECT1 = {
  age: AGE_VALUE1,
  firstName: FIRST_NAME_VALUE1,
  lastName: LAST_NAME_VALUE1,
  me: ME_VALUE1
};

export const TEST_OBJECT2 = {
  age: AGE_VALUE2,
  firstName: FIRST_NAME_VALUE2,
  lastName: LAST_NAME_VALUE2,
  me: ME_VALUE2
};

export const MULTIPLE_DOCUMENTS_TEST_OBJECT = {
  person1: TEST_OBJECT1,
  person2: TEST_OBJECT2
};

export const MULTIPLE_ARRAYS_TEST_OBJECT = {
  ages: [AGE_VALUE1, AGE_VALUE2],
  first_names: [
    { firstName: FIRST_NAME_VALUE1 },
    { firstName: FIRST_NAME_VALUE2 }
  ],
  last_names: [{ lastName: LAST_NAME_VALUE1 }, { lastName: LAST_NAME_VALUE2 }],
  people: [
    {
      age: AGE_VALUE1,
      firstName: FIRST_NAME_VALUE1,
      lastName: LAST_NAME_VALUE1
    },
    {
      age: AGE_VALUE2,
      firstName: FIRST_NAME_VALUE2,
      lastName: LAST_NAME_VALUE2
    }
  ]
};
