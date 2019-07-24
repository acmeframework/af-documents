import { isUsable } from 'af-conditionals';
import cloneDeep from 'lodash/cloneDeep';

import { StringNormalizer } from './normalizers';
import { Property, PropertyOptions } from './property';
import {
  DEFAULT_STRING_MAX_LENGTH,
  DEFAULT_STRING_MIN_LENGTH,
  DEFAULT_STRING_NORMALIZE_TO_LOWER,
  DEFAULT_STRING_NORMALIZE_TO_UPPER,
  DEFAULT_STRING_PROPERTY_NAME,
  DEFAULT_STRING_TRIM_LEFT,
  DEFAULT_STRING_TRIM_RIGHT,
} from './string-property-defs';
import { StringValidator } from './validators';

export interface StringPropertyOptions extends PropertyOptions {
  // We duplicate the options from our StringValidator and StringNormalizer
  // here SO if you want to simply set the options here, the default
  // StringValidator and StringNormalizer will be created using these
  // options. QoL
  maxLength?: number;
  minLength?: number;
  normalizeToLower?: boolean;
  normalizeToUpper?: boolean;
  trimLeft?: boolean;
  trimRight?: boolean;
}

export const DEFAULT_STRING_PROPERTY_OPTIONS: Readonly<
  StringPropertyOptions
> = {
  maxLength: DEFAULT_STRING_MAX_LENGTH,
  minLength: DEFAULT_STRING_MIN_LENGTH,
  name: DEFAULT_STRING_PROPERTY_NAME,
  normalizeToLower: DEFAULT_STRING_NORMALIZE_TO_LOWER,
  normalizeToUpper: DEFAULT_STRING_NORMALIZE_TO_UPPER,
  trimLeft: DEFAULT_STRING_TRIM_LEFT,
  trimRight: DEFAULT_STRING_TRIM_RIGHT
};

export class StringProperty<
  O extends StringPropertyOptions = StringPropertyOptions
> extends Property<string, O> {
  protected _setValue(newValue: string | undefined): void {
    this.data = String(newValue);
  }

  protected initDefaultNormalizers(): void {
    super.initDefaultNormalizers();
    this.normalizers.push(new StringNormalizer({ parent: this }));
  }

  protected initDefaultValidators(): void {
    super.initDefaultValidators();
    this.validators.push(new StringValidator({ parent: this }));
  }

  /**
   * @description Ensure that our options property has valid values.
   * @protected
   * @param {O} newOptions
   * @memberof StringProperty
   */
  protected _validateOptions(newOptions: O): void {
    super._validateOptions(newOptions);

    this.options.maxLength =
      this.options.maxLength || DEFAULT_STRING_MAX_LENGTH;
    this.options.minLength =
      this.options.minLength || DEFAULT_STRING_MIN_LENGTH;
    if (!isUsable(this.options.normalizeToLower)) {
      this.options.normalizeToLower = DEFAULT_STRING_NORMALIZE_TO_LOWER;
    }
    if (!isUsable(this.options.normalizeToUpper)) {
      this.options.normalizeToUpper = DEFAULT_STRING_NORMALIZE_TO_UPPER;
    }
    if (!isUsable(this.options.trimLeft)) {
      this.options.trimLeft = DEFAULT_STRING_TRIM_LEFT;
    }
    if (!isUsable(this.options.trimRight)) {
      this.options.trimRight = DEFAULT_STRING_TRIM_RIGHT;
    }
  }
}

export function stringPropertyFactory(
  value: string,
  name?: string,
  displayName?: string,
  defaultName = DEFAULT_STRING_PROPERTY_NAME,
  options?: StringPropertyOptions
): StringProperty {
  const pc = StringProperty.getNextPropertyCount();

  if (!isUsable(options)) {
    options = cloneDeep(DEFAULT_STRING_PROPERTY_OPTIONS);
    // For consistent creation of default property names we make options.name
    // an empty string here.
    options.name = '';
  }
  options!.name = name || options!.name || defaultName + '_' + pc;
  options!.displayName = displayName || options!.displayName || options!.name;

  return new StringProperty(value, options!);
}
