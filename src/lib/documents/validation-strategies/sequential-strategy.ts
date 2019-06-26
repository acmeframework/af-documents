import waitUntil from 'async-wait-until';

import { Entity } from '../../entity';
import { DocumentEntity } from '../document';
import {
  ValidationStrategy,
  ValidationStrategyOptions,
} from './validation-strategy';

export class SequentialValidationStrategy<
  T extends Record<string, any> = Record<string, any>,
  O extends ValidationStrategyOptions = ValidationStrategyOptions
> extends ValidationStrategy<T, O> {
  protected async _validate(data: T): Promise<boolean> {
    const objKeys = Object.keys(data);
    let loopValid = true;
    for (const key of objKeys) {
      let _valid: boolean;
      const entity = data![key];
      _valid = await this._validateEntity(key, [entity]);
      if (loopValid && !_valid) {
        loopValid = false;
      }
    }
    return Promise.resolve(loopValid);
  }

  protected async _validateEntity(
    key: string,
    entities: DocumentEntity[]
  ): Promise<boolean> {
    let loopValid = true;
    for (const entity of entities) {
      let _valid: boolean;
      if (entity instanceof Entity) {
        // ! This code block is needed IF the document has mutable fields.
        // ! See test #3 for a description of the potential problem.
        if (entity.isValidating()) {
          // This await will either succeed or timeout with an
          // Exception. If it succeeds we process as normal.
          await waitUntil(
            (): boolean => {
              return !entity.isValidating();
            },
            this.options.validationWaitTimeout,
            this.options.validationWaitInterval
          );
        }

        _valid = await entity.validate();
      } else {
        // It can only be an array, since that is all we build
        // entities and arrays.
        _valid = await this._validateEntity(key, entity as DocumentEntity[]);
      }
      if (loopValid && !_valid) {
        loopValid = false;
        if (this.options.validationStopOnInvalid) break;
      }
    }
    return Promise.resolve(loopValid);
  }
}
