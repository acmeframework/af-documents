import 'mocha';

import { expect } from 'chai';

import { NoopNormalizer } from '../../../../src/lib';

describe('NoopNormalizer class', function() {
  const NORMALIZER_NAME = 'Test Normalizer';
  const STRING_DATA = 'Hello World';

  describe('Testing functionality of the class as a string', function() {
    const TEST_OPTIONS = [{ name: NORMALIZER_NAME }, {}];

    let nn: NoopNormalizer<string>;
    let testNumber = 0;

    beforeEach(function() {
      const options = TEST_OPTIONS[testNumber++];
      nn = new NoopNormalizer(options);
    });

    it('validates a default NoopNormalizer (String)', function() {
      expect(nn.normalize(STRING_DATA)).to.equal(STRING_DATA);
    });
  });
});
