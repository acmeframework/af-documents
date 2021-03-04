import { isUsable } from 'af-conditionals';
import cloneDeep from 'lodash/cloneDeep';

import { Property, PropertyOptions } from './property';
import { BooleanValidator } from './validators';

export const DEFAULT_BOOLEAN_PROPERTY_NAME = 'boolean_property';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BooleanPropertyOptions extends PropertyOptions {}

export const DEFAULT_BOOLEAN_PROPERTY_OPTIONS: Readonly<BooleanPropertyOptions> = {
  name: DEFAULT_BOOLEAN_PROPERTY_NAME,
};

export class BooleanProperty<
  O extends BooleanPropertyOptions = BooleanPropertyOptions
> extends Property<boolean, O> {
  protected initDefaultValidators(): void {
    super.initDefaultValidators();
    this.validators.push(new BooleanValidator({ parent: this }));
  }
}

export function booleanPropertyFactory(
  value: boolean,
  name?: string,
  displayName?: string,
  defaultName = DEFAULT_BOOLEAN_PROPERTY_NAME,
  options?: BooleanPropertyOptions
): BooleanProperty {
  const pc = BooleanProperty.getNextPropertyCount();

  if (!isUsable(options)) {
    options = cloneDeep(DEFAULT_BOOLEAN_PROPERTY_OPTIONS);
    // For consistent creation of default property names we make options.name
    // an empty string here.
    options.name = '';
  }
  options!.name = name || options!.name || defaultName + '_' + pc;
  options!.displayName = displayName || options!.displayName || options!.name;

  return new BooleanProperty(value, options!);
}
