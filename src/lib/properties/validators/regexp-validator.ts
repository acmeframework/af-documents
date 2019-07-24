import { isUsable } from 'af-conditionals';

import { RegExpPropertyOptions } from '../regexp-property';
import { StringValidator, StringValidatorOptions } from './string-validator';

export interface RegExpValidatorOptions extends StringValidatorOptions {
  // This is marked option here to make implementing a default RegExpValidator
  // via RegExpProperty easier. If no mask is defined to the
  // RegExpValidator class or the RegExpProperty parent then an exception
  // will be thrown.
  mask?: RegExp;
}

export class RegExpValidator<
  O extends RegExpValidatorOptions = RegExpValidatorOptions
> extends StringValidator<O> {
  protected async _validate(value: string): Promise<boolean> {
    const valid = this.options.mask!.test(value);
    if (!valid) {
      this.addInvalidError([
        this.options.displayName + ' is not in the required format.'
      ]);
    }
    return Promise.resolve(valid);
  }

  protected _validateOptions(newOptions: O) {
    super._validateOptions(newOptions);

    const haveParent = isUsable(this.options.parent);
    let parentOptions: RegExpPropertyOptions;
    if (haveParent) {
      parentOptions = this.options.parent!.getOptions();
    }

    if (
      (!haveParent && !isUsable(this.options.mask)) ||
      (haveParent &&
        !isUsable(this.options.mask) &&
        !isUsable(parentOptions!.mask))
    ) {
      throw new TypeError('You must supply a valid options object');
    }
    if (haveParent) {
      this.options.mask = this.options.mask || parentOptions!.mask;
    }
  }
}
