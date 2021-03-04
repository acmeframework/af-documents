import { isUsable } from 'af-conditionals';
import cloneDeep from 'lodash/cloneDeep';

import {
  DEFAULT_EMAIL_MASK,
  DEFAULT_EMAIL_PROPERTY_NAME,
  MAXIMUM_EMAIL_ADDRESS_LEN,
  MINIMUM_EMAIL_ADDRESS_LEN,
} from './email-property-defs';
import { RegExpProperty, RegExpPropertyOptions } from './regexp-property';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EmailPropertyOptions extends RegExpPropertyOptions {}

export const DEFAULT_EMAIL_PROPERTY_OPTIONS: Readonly<EmailPropertyOptions> = {
  mask: DEFAULT_EMAIL_MASK,
  maxLength: MAXIMUM_EMAIL_ADDRESS_LEN,
  minLength: MINIMUM_EMAIL_ADDRESS_LEN,
  name: DEFAULT_EMAIL_PROPERTY_NAME,
};

export class EmailProperty<
  O extends EmailPropertyOptions = EmailPropertyOptions
> extends RegExpProperty<O> {
  protected _validateOptions(newOptions: O): void {
    // We override values that RegExpProperty and descendants are
    // responsible for. We must ensure they have valid values here
    // before any descendants set them.
    newOptions.mask = newOptions.mask || DEFAULT_EMAIL_MASK;
    newOptions.maxLength = newOptions.maxLength || MAXIMUM_EMAIL_ADDRESS_LEN;
    if (
      newOptions.maxLength > MAXIMUM_EMAIL_ADDRESS_LEN ||
      newOptions.maxLength < MINIMUM_EMAIL_ADDRESS_LEN
    ) {
      newOptions.maxLength = MAXIMUM_EMAIL_ADDRESS_LEN;
    }
    newOptions.minLength = newOptions.minLength || MINIMUM_EMAIL_ADDRESS_LEN;
    if (
      newOptions.minLength < MINIMUM_EMAIL_ADDRESS_LEN ||
      newOptions.minLength > MAXIMUM_EMAIL_ADDRESS_LEN
    ) {
      newOptions.minLength = MINIMUM_EMAIL_ADDRESS_LEN;
    }
    if (newOptions.maxLength < newOptions.minLength) {
      newOptions.maxLength = MAXIMUM_EMAIL_ADDRESS_LEN;
    }
    // We do not need to test if minLength is greater than maxLength since
    // we have normalized the values to within MINIMUM_EMAIL_ADDRESS_LEN and
    // MAXIMUM_EMAIL_ADDRESS_LEN. Therefore, the worst case is that minLength
    // is equal to MAXIMUM_EMAIL_ADDRESS_LEN which is "silly" but valid.
    super._validateOptions(newOptions);
  }
}

export function emailPropertyFactory(
  value: string,
  name?: string,
  displayName?: string,
  defaultName = DEFAULT_EMAIL_PROPERTY_NAME,
  options?: EmailPropertyOptions
): EmailProperty {
  const pc = RegExpProperty.getNextPropertyCount();

  if (!isUsable(options)) {
    options = cloneDeep(DEFAULT_EMAIL_PROPERTY_OPTIONS);
    // For consistent creation of default property names we make options.name
    // an empty string here.
    options.name = '';
  }
  options!.name = name || options!.name || defaultName + '_' + pc;
  options!.displayName = displayName || options!.displayName || options!.name;

  return new EmailProperty(value, options!);
}
