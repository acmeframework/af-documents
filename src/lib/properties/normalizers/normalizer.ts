import { isUsable } from 'af-conditionals';
import { EventEmitter } from 'eventemitter3';

import { Property } from '../property';
import {
  PROPERTY_NORMALIZE_EVENT,
  PropertyValueChangeEvent,
} from '../property-defs';

export const DEFAULT_NORMALIZER_NAME = 'generic_normalizer';

export interface NormalizerOptions {
  displayName?: string;
  name?: string;
  parent?: Property;
}

export abstract class Normalizer<
  T = any,
  O extends NormalizerOptions = NormalizerOptions
> extends EventEmitter {
  public static getNextNormalizerCount(): number {
    return ++Normalizer.normalizerCount;
  }

  public static getNormalizerCount(): number {
    return Normalizer.normalizerCount;
  }

  protected static normalizerCount = 0;

  protected lastValue: T | undefined;
  protected options!: O;

  constructor(newOptions?: O) {
    super();

    this._validateOptions(newOptions);
    delete this.options.parent;
  }

  public getOptions(): O {
    return JSON.parse(JSON.stringify(this.options));
  }

  public normalize(value: T): T {
    // This will return if the value sent in matches the
    // last value we normalized (i.e. it is already normalized)
    if (value === this.lastValue) return value;

    const previousValue = value;
    const newValue = this._normalize(value);
    this.lastValue = newValue;

    const event: PropertyValueChangeEvent<T> = {
      context: this,
      displayName: this.options.displayName!,
      name: this.options.name!,
      previousValue,
      value: newValue,
    };
    this.emit(PROPERTY_NORMALIZE_EVENT, event, this);

    return newValue;
  }

  protected abstract _normalize(value: T): T;

  protected _validateOptions(newOptions: O | undefined): void {
    const gc = Normalizer.getNextNormalizerCount();
    const defaultOptions: O = {
      displayName: DEFAULT_NORMALIZER_NAME + '_' + gc,
      name: DEFAULT_NORMALIZER_NAME + '_' + gc,
      parent: undefined,
    } as O;

    if (isUsable(newOptions)) {
      this.options = newOptions!;

      if (isUsable(newOptions!.parent)) {
        const parentOptions = newOptions!.parent!.getOptions();
        this.options.displayName =
          this.options.displayName || parentOptions.displayName;
        this.options.name = this.options.name || parentOptions.name;
      }
    } else {
      this.options = defaultOptions;
    }

    // To eliminate additional logic displayName needs to come
    // before name, it is a plus that it is alphabetically ordered.
    // Effectively, we only want displayName to equal name IF name is
    // already defined.
    this.options.displayName =
      this.options.displayName ||
      this.options.name ||
      defaultOptions.displayName;
    this.options.name = this.options.name || defaultOptions.name;
  }
}
