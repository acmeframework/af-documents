import 'mocha';

import { expect } from 'chai';

import {
  AlwaysValidValidator,
  AlwaysValidValidatorOptions,
} from '../../../../src/lib';

// tslint:disable:no-unused-expression

class StringAlwaysValidValidator extends AlwaysValidValidator<
  string,
  AlwaysValidValidatorOptions
> {}

describe('AlwaysValidValidator class', function() {
  const VALIDATOR_NAME = 'Test String';
  const STRING_DATA = 'Hello World';
  const EMPTY_STRING_DATA = '';

  describe('Testing functionality of the class as a String', function() {
    it('validates a default StringAlwaysValidValidator', async function() {
      const savv = new StringAlwaysValidValidator({ name: VALIDATOR_NAME });

      expect(await savv.validate(STRING_DATA)).to.be.true;
      expect(await savv.validate(EMPTY_STRING_DATA)).to.be.true;
    });
  });
});
