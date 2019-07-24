import { isUsable } from 'af-conditionals';

import { StringPropertyOptions } from '../string-property';
import {
  DEFAULT_STRING_MAX_LENGTH,
  DEFAULT_STRING_MIN_LENGTH,
} from '../string-property-defs';
import { Validator, ValidatorOptions } from './validator';

export interface StringValidatorOptions extends ValidatorOptions {
  maxLength?: number;
  minLength?: number;
}

export class StringValidator<
  O extends StringValidatorOptions = StringValidatorOptions
> extends Validator<string, O> {
  protected async _validate(value: string): Promise<boolean> {
    let valid = true;
    if (valid && this.options.minLength! > 0) {
      valid =
        value.length >= this.options.minLength! ||
        (!this.options.required && value.length === 0);

      if (!valid) {
        this.addInvalidError([
          this.options.displayName + ' is shorter than the minimum length.'
        ]);
      }
    }
    if (valid && this.options.maxLength! > 0) {
      valid = value.length <= this.options.maxLength!;
      if (!valid) {
        this.addInvalidError([
          this.options.displayName + ' is longer than the maximum length.'
        ]);
      }
    }
    return Promise.resolve(valid);
  }

  protected _validateOptions(newOptions: O) {
    super._validateOptions(newOptions);

    const haveParent = isUsable(this.options.parent);
    let parentOptions: StringPropertyOptions;
    if (haveParent) parentOptions = this.options.parent!.getOptions();

    let defaultMaxLength = DEFAULT_STRING_MAX_LENGTH;
    let defaultMinLength = DEFAULT_STRING_MIN_LENGTH;
    if (haveParent) {
      defaultMaxLength = parentOptions!.maxLength || defaultMaxLength;
      defaultMinLength = parentOptions!.minLength || defaultMinLength;
    }
    this.options.maxLength = this.options.maxLength || defaultMaxLength;
    this.options.minLength = this.options.minLength || defaultMinLength;

    if (
      this.options.maxLength > 0 &&
      this.options.minLength > this.options.maxLength
    ) {
      throw new TypeError('You must provide a valid options object.');
    }
  }
}
