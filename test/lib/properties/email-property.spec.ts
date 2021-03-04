import 'mocha';

import { expect } from 'chai';

import {
  DEFAULT_EMAIL_PROPERTY_NAME,
  DEFAULT_EMAIL_PROPERTY_OPTIONS,
  DEFAULT_ENTITY_OPTIONS,
  DEFAULT_PROPERTY_OPTIONS,
  DEFAULT_REGEXP_PROPERTY_OPTIONS,
  DEFAULT_STRING_PROPERTY_OPTIONS,
  EmailProperty,
  emailPropertyFactory,
  EmailPropertyOptions,
} from '../../../src/lib';

describe('EmailProperty class', function () {
  const PROPERTY_NAME = 'Email Property';
  const EMAIL_DATA = 'test@example.com';

  describe('Test the factory method', function () {
    const depo = {
      ...DEFAULT_ENTITY_OPTIONS,
      ...DEFAULT_PROPERTY_OPTIONS,
      ...DEFAULT_STRING_PROPERTY_OPTIONS,
      ...DEFAULT_REGEXP_PROPERTY_OPTIONS,
      ...DEFAULT_EMAIL_PROPERTY_OPTIONS,
    };
    let ep: EmailProperty;

    function testOptions() {
      const epo = ep.getOptions();
      expect(epo).to.deep.equal(depo);
    }

    it('creates a EmailProperty with defaults for an email address', function () {
      ep = emailPropertyFactory(EMAIL_DATA);
      expect(ep).to.be.an.instanceof(EmailProperty);

      const rec = EmailProperty.getPropertyCount();
      const dn = DEFAULT_EMAIL_PROPERTY_NAME + '_' + rec;
      depo.name = dn;
      depo.displayName = dn;
      testOptions();
    });

    it('creates a EmailProperty with a supplied name', function () {
      ep = emailPropertyFactory(EMAIL_DATA, PROPERTY_NAME);
      expect(ep).to.be.an.instanceof(EmailProperty);

      depo.name = PROPERTY_NAME;
      depo.displayName = PROPERTY_NAME;
      testOptions();
    });

    it('creates a EmailProperty with various options', function () {
      // No options
      ep = new EmailProperty(EMAIL_DATA, {
        name: PROPERTY_NAME,
      } as EmailPropertyOptions);
      expect(ep).to.be.an.instanceof(EmailProperty);

      // maxLength set to high...
      ep = new EmailProperty(EMAIL_DATA, {
        maxLength: 3000,
        name: PROPERTY_NAME,
      } as EmailPropertyOptions);
      expect(ep).to.be.an.instanceof(EmailProperty);

      // minLength set to low...
      ep = new EmailProperty(EMAIL_DATA, {
        minLength: 2,
        name: PROPERTY_NAME,
      } as EmailPropertyOptions);
      expect(ep).to.be.an.instanceof(EmailProperty);

      // maxLength set to lower than minLength...
      ep = new EmailProperty(EMAIL_DATA, {
        maxLength: 3,
        minLength: 5,
        name: PROPERTY_NAME,
      } as EmailPropertyOptions);
      expect(ep).to.be.an.instanceof(EmailProperty);

      // minLength set higher than maxLength...
      ep = new EmailProperty(EMAIL_DATA, {
        maxLength: 10,
        minLength: 255,
        name: PROPERTY_NAME,
      } as EmailPropertyOptions);
      expect(ep).to.be.an.instanceof(EmailProperty);
    });
  });

  /*
   * The test email addresses given below are inspired (and some directly
   * copied) from https://en.wikipedia.org/wiki/Email_address.
   *
   * The list below does not contain an exhaustive list presently
   * (08/26/2018 MJC) but such a list is intended.
   *
   * The commented out addresses current do not pass for their intended
   * use (i.e. valid for goodTestEmails and invalid for badTestEmails).
   * Future work will be performed in order to ensure that this validity
   * is as accurate as possible. However, the current passing tests
   * represent the vast majority of cases on the public internet and
   * cover a large portion of potential edge cases.
   */
  // TODO: Build test cases and code to cover all possible email address
  // TODO: formats allowed by the RFC's.
  describe('Tests various email formats for validation', function () {
    const goodTestEmails = [
      'test@example.com',
      'test+me@example.com',
      'test_me+you@example.com',
      '"test..me"@example.com',
      "!#$%&'*+-/=?^_`{|}~@example.com",
      '".test.me"@example.com',
      '"test.me."@example.com',
      '"(comment)test.me"@example.com',
      '"test.me(comment)"@example.com',
      'x@example.com',
      // ! "\"very.(),:;<>[]\".VERY.\"very@\\ \"very\".unusual\"@strange.example.com",
      'test-me+you@example.com',
      // !"test@example",
      // ! "\"()<>[]:,;@\\\"!#$%&'-/=?^_`{}| ~.a\"@example.org",
      'example@s.example',
      'test@[192.168.1.1]',
      // ! "test@[2001:DB8::1]",
      // ! "\" \"@example.com"
    ];

    const badTestEmails = [
      'test..me@example.com',
      '.test.me@example.com',
      'test.me.@example.com',
      'test(comment).me@example.com',
      '(comment)test.me@example.com',
      'test.me(comment)@example.com',
      'test.example.com',
      'test@me@example.com',
      'a"b(c)d,e:f;g<h>i[jk]l@example.com',
      'just"not"right@example.com',
      'this is"notallowed@example.com',
      'this still"not\\allowed@example.com',
      // ! "1234567890123456789012345678901234567890123456789012345678901234+x@example.com",
      'test.me@example..com',
    ];

    goodTestEmails.forEach(
      async (value: string): Promise<void> => {
        it(`expects the email address ${value} to be valid`, async function () {
          const ep = emailPropertyFactory(value, PROPERTY_NAME);
          expect(await ep.validate()).to.be.true;
        });
      }
    );

    badTestEmails.forEach(
      async (value: string): Promise<void> => {
        it(`expects the email address ${value} to be invalid`, async function () {
          const ep = emailPropertyFactory(value, PROPERTY_NAME);
          expect(await ep.validate()).to.be.false;
        });
      }
    );
  });
});
