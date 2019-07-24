import 'mocha';

import { expect } from 'chai';

import { BooleanValidator } from '../../../../src/lib';

// tslint:disable:no-unused-expression

describe('BooleanValidator class', function() {
  const VALIDATOR_NAME = 'Test Boolean';
  const BOOLEAN_DATA = true;
  const EMPTY_BOOLEAN_DATA = undefined;

  describe('Testing functionality of the class as a String', function() {
    it('validates a default BooleanValidator', async function() {
      const bv = new BooleanValidator({ name: VALIDATOR_NAME });

      expect(await bv.validate(BOOLEAN_DATA)).to.be.true;
      // @ts-ignore
      expect(await bv.validate(EMPTY_BOOLEAN_DATA)).to.be.false;
    });
  });
});
