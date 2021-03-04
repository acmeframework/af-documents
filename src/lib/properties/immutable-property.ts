import { isEmpty, isUsable } from 'af-conditionals';

import { Entity, EntityOptions } from '../entity';
import { ValidatorError } from './validators';

export const DEFAULT_IMMUTABLE_PROPERTY_NAME = 'immutable_property';

export interface ImmutablePropertyOptions extends EntityOptions {
  displayName?: string;
  name: string;
}

export class ImmutableProperty<
  T = any,
  O extends ImmutablePropertyOptions = ImmutablePropertyOptions
> extends Entity<T, O> {
  public static getNextPropertyCount(): number {
    return ++ImmutableProperty.propertyCount;
  }

  public static getPropertyCount(): number {
    return ImmutableProperty.propertyCount;
  }

  protected static propertyCount = 0;

  constructor(newValue: T, newName: string, newDisplayName?: string) {
    super({
      displayName: newDisplayName,
      name: newName,
    } as O);

    if (!this.isValueAllowed(newValue)) {
      throw new TypeError(this.options.displayName + ' is not usable.');
    }
    this.data = newValue;
  }

  public get value(): T | undefined {
    return this.data;
  }

  public getErrors(): ValidatorError[] {
    return [];
  }

  public getName(): string {
    return this.options.name;
  }

  public isEqual(otherValue: T): boolean {
    return this.data === otherValue;
  }

  public isNormalized(): boolean {
    return true;
  }

  public isRequired(): boolean {
    return false;
  }

  public isValid(): boolean {
    return true;
  }

  public isValidating(): boolean {
    return false;
  }

  public normalize(): void {
    // the value is assumed normal as the developer submitted it
  }

  public reset(): void {
    return; // Nothing to do...
  }

  public toString(): string {
    return String(this.value);
  }

  public async validate(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public valueOf(): T | undefined {
    return this.value;
  }

  protected isValueAllowed(newValue: T): boolean {
    return isUsable(newValue);
  }

  protected _validateOptions(newOptions: O): void {
    if (!isUsable(newOptions.name) || isEmpty(newOptions.name)) {
      throw new TypeError('Must supply a valid options object.');
    }

    super._validateOptions(newOptions);
  }
}

export function immutablePropertyFactory<T>(
  value: T,
  name?: string,
  displayName?: string,
  defaultName = DEFAULT_IMMUTABLE_PROPERTY_NAME
): ImmutableProperty<T> {
  const ic = ImmutableProperty.getNextPropertyCount();
  name = name || defaultName + '_' + ic;
  displayName = displayName || name;
  return new ImmutableProperty<T>(value, name, displayName);
}
