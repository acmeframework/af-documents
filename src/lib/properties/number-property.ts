import { isUsable } from 'af-conditionals';
import cloneDeep from 'lodash/cloneDeep';

import {
  DEFAULT_NUMBER_BOUNDS,
  DEFAULT_NUMBER_MAX_VALUE,
  DEFAULT_NUMBER_MIN_VALUE,
  DEFAULT_NUMBER_PROPERTY_NAME,
  NumberBoundTypes,
} from './number-property-defs';
import { Property, PropertyOptions } from './property';
import { NumberValidator } from './validators';

export interface NumberPropertyOptions extends PropertyOptions {
  maxValue?: number;
  minValue?: number;
  numberBounds?: NumberBoundTypes;
}

export const DEFAULT_NUMBER_PROPERTY_OPTION: Readonly<NumberPropertyOptions> = {
  maxValue: DEFAULT_NUMBER_MAX_VALUE,
  minValue: DEFAULT_NUMBER_MIN_VALUE,
  name: DEFAULT_NUMBER_PROPERTY_NAME,
  numberBounds: DEFAULT_NUMBER_BOUNDS,
};

export class NumberProperty<
  O extends NumberPropertyOptions = NumberPropertyOptions
> extends Property<number, O> {
  protected initDefaultValidators(): void {
    super.initDefaultValidators();
    this.validators.push(new NumberValidator({ parent: this }));
  }
}

export function numberPropertyFactory(
  value: number,
  name?: string,
  displayName?: string,
  defaultName = DEFAULT_NUMBER_PROPERTY_NAME,
  options?: NumberPropertyOptions
): NumberProperty {
  const pc = NumberProperty.getNextPropertyCount();

  if (!isUsable(options)) {
    options = cloneDeep(DEFAULT_NUMBER_PROPERTY_OPTION);
    // For consistent creation of default property names we make options.name
    // an empty string here.
    options.name = '';
  }
  options!.name = name || options!.name || defaultName + '_' + pc;
  options!.displayName = displayName || options!.displayName || options!.name;

  return new NumberProperty(value, options!);
}
