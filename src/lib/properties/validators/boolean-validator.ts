import { isEmpty } from 'af-conditionals';

import { Validator, ValidatorOptions } from './validator';

export interface BooleanValidatorOptions extends ValidatorOptions {}

export class BooleanValidator<
  O extends BooleanValidatorOptions = BooleanValidatorOptions
> extends Validator<boolean, O> {
  protected async _validate(value: boolean): Promise<boolean> {
    return Promise.resolve(!isEmpty(value));
  }
}
