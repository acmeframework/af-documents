import 'mocha';

import { isUsable } from 'af-conditionals';
import { expect } from 'chai';

import {
  Document,
  SequentialValidationStrategy,
  ValidationStrategyOptions,
} from '../../../../src/lib';
import { MULTIPLE_ARRAYS_TEST_OBJECT } from '../document-test-data';

// tslint:disable:no-unused-expression no-null-keyword

describe('SequentialValidationStrategy class', function() {
  describe('Testing functionality of the class', function() {
    let document: Document | undefined;
    let vst: SequentialValidationStrategy;

    function setupTestObjects(
      options: ValidationStrategyOptions | undefined
    ): void {
      if (!isUsable(document)) {
        document = new Document(MULTIPLE_ARRAYS_TEST_OBJECT);
      }
      vst = new SequentialValidationStrategy(undefined, options);
    }

    it(' 1. tests setting our defaults based upon our parent', function() {
      document = new Document(MULTIPLE_ARRAYS_TEST_OBJECT);
      vst = new SequentialValidationStrategy(document);
      expect(vst).to.not.be.undefined;
      document = undefined;
    });

    it(' 2. validates a using a SequentialValidationStrategy', async function() {
      setupTestObjects(undefined);
      expect(await vst.validate(document!.getEntities())).to.be.true;
      document = undefined;
    });
  });
});
