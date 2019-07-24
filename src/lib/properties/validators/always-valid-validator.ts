import { Validator, ValidatorOptions } from './validator';

export interface AlwaysValidValidatorOptions extends ValidatorOptions {}

export class AlwaysValidValidator<
  T = any,
  O extends AlwaysValidValidatorOptions = AlwaysValidValidatorOptions
> extends Validator<T, O> {
  // We must use the ts-ignore directive since we never use value in our
  // method.
  // @ts-ignore
  protected async _validate(value: T): Promise<boolean> {
    return Promise.resolve(true);
  }
}
