import { isEmpty } from 'af-conditionals';

import { Validator, ValidatorOptions } from './validator';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BooleanValidatorOptions extends ValidatorOptions {}

export class BooleanValidator<
  O extends BooleanValidatorOptions = BooleanValidatorOptions
> extends Validator<boolean, O> {
  protected async _validate(value: boolean): Promise<boolean> {
    return Promise.resolve(!isEmpty(value));
  }
}
