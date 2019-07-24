import { isUsable } from 'af-conditionals';
import cloneDeep from 'lodash/cloneDeep';

import {
  DEFAULT_REGEXP_MASK,
  DEFAULT_REGEXP_PROPERTY_NAME,
} from './regexp-property-defs';
import { StringProperty, StringPropertyOptions } from './string-property';
import { RegExpValidator } from './validators';

export interface RegExpPropertyOptions extends StringPropertyOptions {
  mask?: RegExp;
}

export const DEFAULT_REGEXP_PROPERTY_OPTIONS: Readonly<
  RegExpPropertyOptions
> = {
  mask: DEFAULT_REGEXP_MASK,
  name: DEFAULT_REGEXP_PROPERTY_NAME
};

export class RegExpProperty<
  O extends RegExpPropertyOptions = RegExpPropertyOptions
> extends StringProperty<O> {
  protected initDefaultValidators(): void {
    super.initDefaultValidators();
    this.validators.push(new RegExpValidator({ parent: this }));
  }

  protected _validateOptions(newOptions: O): void {
    super._validateOptions(newOptions);

    this.options.mask = this.options.mask || DEFAULT_REGEXP_MASK;
  }
}

export function regexpPropertyFactory(
  value: string,
  name?: string,
  displayName?: string,
  defaultName = DEFAULT_REGEXP_PROPERTY_NAME,
  options?: RegExpPropertyOptions
): RegExpProperty {
  const pc = RegExpProperty.getNextPropertyCount();

  if (!isUsable(options)) {
    options = cloneDeep(DEFAULT_REGEXP_PROPERTY_OPTIONS);
    // For consistent creation of default property names we make options.name
    // an empty string here.
    options.name = '';
  }
  options!.name = name || options!.name || defaultName + '_' + pc;
  options!.displayName = displayName || options!.displayName || options!.name;

  return new RegExpProperty(value, options!);
}
