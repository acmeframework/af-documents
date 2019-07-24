import 'mocha';

import { expect } from 'chai';

import {
  DEFAULT_VALIDATION_STOP_ON_INVALID,
  DEFAULT_VALIDATION_WAIT_INTERVAL,
  DEFAULT_VALIDATION_WAIT_TIMEOUT,
  Entity,
  EntityOptions,
} from '../../src/lib';

// tslint:disable:no-unused-expression no-null-keyword

class EntityTester<T = any> extends Entity<T, EntityOptions> {
  public normalize(): void {
    return;
  }

  public async validate(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

describe('Entity class', function() {
  describe('Test the construction and options', function() {
    it('instantiates a valid Entity object', function() {
      expect(new EntityTester()).to.be.an.instanceof(EntityTester);
    });

    function testEntityOption(
      loadOptions: EntityOptions,
      testOptions: EntityOptions
    ): void {
      const spt = new EntityTester(loadOptions);
      const spto = spt.getOptions();
      expect(spto).to.deep.equal(testOptions);
    }

    it('ensures all options have valid values', function() {
      const loadOptions: EntityOptions = {};

      // All defaults (displayName = name by default)
      const testOptions: EntityOptions = {
        validationStopOnInvalid: DEFAULT_VALIDATION_STOP_ON_INVALID,
        validationWaitInterval: DEFAULT_VALIDATION_WAIT_INTERVAL,
        validationWaitTimeout: DEFAULT_VALIDATION_WAIT_TIMEOUT
      };

      // Test all defaults
      testEntityOption(loadOptions, testOptions);

      loadOptions.validationStopOnInvalid = true;
      testOptions.validationStopOnInvalid = true;
      testEntityOption(loadOptions, testOptions);

      loadOptions.validationWaitInterval = 40;
      testOptions.validationWaitInterval = 40;
      testEntityOption(loadOptions, testOptions);

      loadOptions.validationWaitTimeout = 1000;
      testOptions.validationWaitTimeout = 1000;
      testEntityOption(loadOptions, testOptions);
    });
  });
});
