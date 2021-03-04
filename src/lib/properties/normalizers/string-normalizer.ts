import { isUsable } from "af-conditionals";

import {
  DEFAULT_STRING_NORMALIZE_TO_LOWER,
  DEFAULT_STRING_NORMALIZE_TO_UPPER,
  DEFAULT_STRING_TRIM_LEFT,
  DEFAULT_STRING_TRIM_RIGHT,
} from "../string-property-defs";
import { Normalizer, NormalizerOptions } from "./normalizer";

export interface StringNormalizerOptions extends NormalizerOptions {
  normalizeToLower?: boolean;
  normalizeToUpper?: boolean;
  trimLeft?: boolean;
  trimRight?: boolean;
}

export const DEFAULT_TRIM_LEFT_MASK = /^[ \t]*/;
export const DEFAULT_TRIM_RIGHT_MASK = /[ \t]*$/;

export class StringNormalizer<
  O extends StringNormalizerOptions = StringNormalizerOptions
> extends Normalizer<string, O> {
  protected _normalize(value: string): string {
    let newValue = value;

    if (this.options.normalizeToLower) {
      newValue = newValue.toLowerCase();
    } else if (this.options.normalizeToUpper) {
      newValue = newValue.toUpperCase();
    }
    if (this.options.trimLeft) {
      newValue = newValue.replace(DEFAULT_TRIM_LEFT_MASK, "");
    }
    if (this.options.trimRight) {
      newValue = newValue.replace(DEFAULT_TRIM_RIGHT_MASK, "");
    }
    return newValue;
  }

  protected _validateOptions(newOptions: O): void {
    super._validateOptions(newOptions);

    const haveParent = isUsable(this.options.parent);
    let parentOptions: StringNormalizerOptions;
    if (haveParent) parentOptions = this.options.parent!.getOptions();

    let defaultNormalizeToLower = DEFAULT_STRING_NORMALIZE_TO_LOWER;
    let defaultNormalizeToUpper = DEFAULT_STRING_NORMALIZE_TO_UPPER;
    let defaultTrimLeft = DEFAULT_STRING_TRIM_LEFT;
    let defaultTrimRight = DEFAULT_STRING_TRIM_RIGHT;

    if (haveParent) {
      // Our parent would have already gone through its validateOptions,
      // therefore, we are ensured these values exist.
      defaultNormalizeToLower = parentOptions!.normalizeToLower!;
      defaultNormalizeToUpper = parentOptions!.normalizeToUpper!;
      defaultTrimLeft = parentOptions!.trimLeft!;
      defaultTrimRight = parentOptions!.trimRight!;
    }
    if (!isUsable(this.options.normalizeToLower)) {
      this.options.normalizeToLower = defaultNormalizeToLower;
    }
    if (!isUsable(this.options.normalizeToUpper)) {
      this.options.normalizeToUpper = defaultNormalizeToUpper;
    }
    if (!isUsable(this.options.trimLeft)) {
      this.options.trimLeft = defaultTrimLeft;
    }
    if (!isUsable(this.options.trimRight)) {
      this.options.trimRight = defaultTrimRight;
    }
    if (this.options.normalizeToLower && this.options.normalizeToUpper) {
      throw new TypeError("You must provide a valid options object.");
    }
  }
}
