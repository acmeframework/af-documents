import { isUsable } from 'af-conditionals';
import { EventEmitter } from 'eventemitter3';

import { Property } from '../property';
import { DEFAULT_REQUIRED } from '../property-defs';

export const VALIDATOR_ENRICHED_DATA_EVENT = 'propertyEnrichedData';

export interface ValidatorEnrichedDataEvent<T> {
  context: any;
  displayName: string;
  enrichedData: any;
  name: string;
  value: T;
}

export enum ValidatorErrorCodes {
  NoError,
  Empty,
  RequiredAndEmpty,
  Invalid,
  RequiredAndInvalid,
  ValidationFailed,
}

export interface ValidatorError {
  code: ValidatorErrorCodes;
  displayName?: string;
  message: string[];
  name: string;
}

export const DEFAULT_VALIDATOR_NAME = 'generic_validator';

export interface ValidatorOptions {
  displayName?: string;
  name?: string;
  parent?: Property;
  required?: boolean;
}

/**
 * Validator provides the foundation upon which value type specific
 * validation methods can be created. The validators created from this class
 * can be used with Properties or on their own.
 *
 * @export
 * @abstract
 * @class Validator
 * @extends {EventEmitter}
 * @implements {PropertyValidator}
 * @template T indicates the type of the value that this class will work with
 * @template O indicates the class for the options this class will work with
 */
export abstract class Validator<
  T = any,
  O extends ValidatorOptions = ValidatorOptions
> extends EventEmitter {
  public static getNextValidatorCount(): number {
    return ++Validator.validatorCount;
  }

  public static getValidatorCount(): number {
    return Validator.validatorCount;
  }

  protected static validatorCount = 0;

  protected errors: ValidatorError[] = [];

  /**
   * lastValid is part of a caching strategy that will short circuit the
   * validate method if the value to be validated is equal to the lastValue.
   * lastValid stores the validation state of the last value to have been
   * validated.
   *
   * @protected
   * @type {boolean}
   * @memberof Validator
   */
  protected lastValid = false;

  /**
   * lastValue caches the last value that was validated using this class. It
   * provides a caching mechanism that will allow the validate method to
   * short circuit the evaluation if lastValue equals the value to be
   * validated.
   *
   * @protected
   * @type {T}
   * @memberof Validator
   * @template T
   */
  protected lastValue: T | undefined;

  protected options!: O;
  protected validating = false;

  constructor(newOptions?: O) {
    super();

    // We use this call to allow descendants to set defaults for higher-level
    // option properties prior to them being tested.
    this._validateOptions(newOptions);
    delete this.options.parent; // Now remove the reference
  }

  public getErrors(): ValidatorError[] {
    return this.errors;
  }

  public getOptions(): O {
    return JSON.parse(JSON.stringify(this.options));
  }

  public isValidating(): boolean {
    return this.validating;
  }

  public isValueAllowed(newValue: T | undefined): boolean {
    return isUsable(newValue);
  }

  public reset(): void {
    this.errors = [];
    this.lastValid = false;
    this.lastValue = undefined;
  }

  public async validate(value: T): Promise<boolean> {
    if (this.validating) {
      throw new Error(
        'You have called validate() while another' +
          ' validate() call is running.'
      );
    }
    if (value === this.lastValue) {
      return Promise.resolve(this.lastValid);
    }
    this.validating = true;
    this.reset(); // We reset our internal state prior to each validation
    try {
      this.lastValid = await this._validate(value);
      // We set lastValue after validating in case validation throws an
      // error.
      this.lastValue = value;
      return Promise.resolve(this.lastValid);
    } finally {
      this.validating = false;
    }
  }

  protected addEmptyError(message: string[]): void {
    this.addError(
      message,
      this.options.required
        ? ValidatorErrorCodes.RequiredAndEmpty
        : ValidatorErrorCodes.Empty
    );
  }

  protected addError(message: string[], errorCode: ValidatorErrorCodes): void {
    this.errors.push({
      code: errorCode,
      displayName: this.options.displayName,
      message,
      name: this.options.name!,
    });
  }

  protected addInvalidError(message: string[]): void {
    this.addError(
      message,
      this.options.required
        ? ValidatorErrorCodes.RequiredAndInvalid
        : ValidatorErrorCodes.Invalid
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected emitEnrichedData(enrichedData: any, value: T): void {
    const event: ValidatorEnrichedDataEvent<T> = {
      context: this,
      displayName: this.options.displayName!,
      enrichedData,
      name: this.options.name!,
      value,
    };
    this.emit(VALIDATOR_ENRICHED_DATA_EVENT, event, this);
  }

  protected abstract _validate(value: T): Promise<boolean>;

  protected _validateOptions(newOptions: O | undefined): void {
    const gc = Validator.getNextValidatorCount();
    const defaultOptions: O = {
      displayName: DEFAULT_VALIDATOR_NAME + '_' + gc,
      name: DEFAULT_VALIDATOR_NAME + '_' + gc,
      parent: undefined,
      required: DEFAULT_REQUIRED,
    } as O;

    if (isUsable(newOptions)) {
      this.options = newOptions!;

      if (isUsable(this.options.parent)) {
        const parentOptions = this.options.parent!.getOptions();

        this.options.displayName =
          this.options.displayName || parentOptions.displayName;
        this.options.name = this.options.name || parentOptions.name;

        if (!isUsable(this.options.required)) {
          this.options.required = parentOptions.required;
        }
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

    if (!isUsable(this.options.required)) {
      this.options.required = defaultOptions.required;
    }
  }
}
