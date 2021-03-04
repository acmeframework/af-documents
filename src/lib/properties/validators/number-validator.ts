import { isUsable } from 'af-conditionals';

import { NumberPropertyOptions } from '../number-property';
import {
  DEFAULT_NUMBER_BOUNDS,
  DEFAULT_NUMBER_MAX_VALUE,
  DEFAULT_NUMBER_MIN_VALUE,
  NumberBoundTypes,
} from '../number-property-defs';
import { Validator, ValidatorOptions } from './validator';

export interface NumberValidatorOptions extends ValidatorOptions {
  maxValue?: number;
  minValue?: number;
  numberBounds?: NumberBoundTypes;
}

export class NumberValidator<
  O extends NumberValidatorOptions = NumberValidatorOptions
> extends Validator<number, O> {
  protected async _validate(value: number): Promise<boolean> {
    let valid = true;
    if (valid && this.options.minValue !== DEFAULT_NUMBER_MIN_VALUE) {
      valid = value >= this.options.minValue!;
      if (!valid) {
        this.addInvalidError([
          this.options.displayName +
            ' cannot be less than the minimum value. (' +
            this.options.minValue +
            ')',
        ]);
      }
    }
    if (valid && this.options.maxValue !== DEFAULT_NUMBER_MAX_VALUE) {
      valid = value <= this.options.maxValue!;
      if (!valid) {
        this.addInvalidError([
          this.options.displayName +
            ' cannot be greater than the maximum value. (' +
            this.options.maxValue +
            ')',
        ]);
      }
    }
    return Promise.resolve(valid);
  }

  protected _validateOptions(newOptions: O): void {
    super._validateOptions(newOptions);

    const haveParent = isUsable(this.options.parent);
    let parentOptions: NumberPropertyOptions;
    if (haveParent) parentOptions = this.options.parent!.getOptions();

    // We must set out numberBounds prior to everything else since maxValue
    // and minValue ranges are dependent upon it.
    let defaultNumberBounds = DEFAULT_NUMBER_BOUNDS;
    if (haveParent) {
      defaultNumberBounds = parentOptions!.numberBounds || defaultNumberBounds;
    }
    this.options.numberBounds =
      this.options.numberBounds || defaultNumberBounds;

    const defaultMaxValue =
      this.options.numberBounds === NumberBoundTypes.max_safe_integer
        ? Number.MAX_SAFE_INTEGER
        : this.options.numberBounds === NumberBoundTypes.infinity
        ? Number.POSITIVE_INFINITY
        : DEFAULT_NUMBER_MAX_VALUE;
    const defaultMinValue =
      this.options.numberBounds === NumberBoundTypes.max_safe_integer
        ? Number.MIN_SAFE_INTEGER
        : this.options.numberBounds === NumberBoundTypes.infinity
        ? Number.NEGATIVE_INFINITY
        : DEFAULT_NUMBER_MAX_VALUE;

    if (haveParent) {
      this.options.maxValue = parentOptions!.maxValue || defaultMaxValue;
      this.options.minValue = parentOptions!.minValue || defaultMinValue;
    }

    this.options.maxValue = this.options.maxValue || defaultMaxValue;
    this.options.minValue = this.options.minValue || defaultMinValue;

    if (
      this.options.minValue !== DEFAULT_NUMBER_MIN_VALUE &&
      this.options.maxValue !== DEFAULT_NUMBER_MAX_VALUE
    ) {
      if (this.options.minValue > this.options.maxValue) {
        throw new RangeError('When set, minValue must be less than maxValue.');
      }
    }
    if (this.options.numberBounds === NumberBoundTypes.max_safe_integer) {
      if (
        this.options.minValue < Number.MIN_SAFE_INTEGER ||
        this.options.maxValue > Number.MAX_SAFE_INTEGER
      ) {
        throw new RangeError(
          'Bounded by MIN/MAX Javascript safe ' +
            'integers and minValue or maxValue are outside that range.'
        );
      }
    }
  }
}
