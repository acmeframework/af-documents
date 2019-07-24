import { isUsable } from 'af-conditionals';
import { EventEmitter } from 'eventemitter3';
import cloneDeep from 'lodash/cloneDeep';

export interface EntityOptions {
  /**
   * If a validation fails then stop validation from continuing if this value
   * is true.
   *
   * @type {boolean}
   * @memberof EntityOptions
   */
  validationStopOnInvalid?: boolean;

  /**
   * When validating our entity, we may have to wait for some condition to
   * stop our blocking, this is how often we will check that condition. This
   * value is in milliseconds (ms).
   *
   * @type {number}
   * @memberof EntityOptions
   */
  validationWaitInterval?: number;

  /**
   * If we are blocked during validation, wait a total of "this" long before
   * we give up. This value is in milliseconds (ms).
   *
   * @type {number}
   * @memberof EntityOptions
   */
  validationWaitTimeout?: number;
}

/**
 * Default value for
 * {@link EntityOptions#validationStopOnInvalid | validationStopOnInvalid}.
 */
export const DEFAULT_VALIDATION_STOP_ON_INVALID = false;

/**
 * Default value for
 * {@link EntityOptions#validationWaitInterval | validationWaitInterval}.
 */
export const DEFAULT_VALIDATION_WAIT_INTERVAL = 10;

/**
 * Default value for
 * {@link EntityOptions#validationWaitTimeout | validationWaitTimeout}.
 */
export const DEFAULT_VALIDATION_WAIT_TIMEOUT = 500;

/**
 * Defaults for {@link EntityOptions}.
 */
export const DEFAULT_ENTITY_OPTIONS: Readonly<EntityOptions> = {
  validationStopOnInvalid: DEFAULT_VALIDATION_STOP_ON_INVALID,
  validationWaitInterval: DEFAULT_VALIDATION_WAIT_INTERVAL,
  validationWaitTimeout: DEFAULT_VALIDATION_WAIT_TIMEOUT
};

/**
 * Entity is a base abstract class for the {@link Property} class and
 * {@link Document} class.
 *
 * @export
 * @abstract
 * @class Entity
 * @extends {EventEmitter}
 * @template T
 * @template O
 */
export abstract class Entity<
  T = any,
  O extends EntityOptions = EntityOptions
> extends EventEmitter {
  protected data: T | undefined;
  protected normalizing = false;
  protected options!: O;
  protected validating = false;

  /**
   * Creates an instance of Entity.
   *
   * @param {O} [newOptions]
   * @memberof Entity
   */
  constructor(newOptions?: O) {
    super();

    this._validateOptions(newOptions);
  }

  /**
   * Returns a copy of the options for this Property.
   *
   * @returns {O}
   * @memberof Property
   */
  public getOptions(): O {
    // We do not want to return a reference to our options, just a copy
    return cloneDeep<O>(this.options);
  }

  public isNormalizing(): boolean {
    return this.normalizing;
  }

  public isValidating(): boolean {
    return this.validating;
  }

  public abstract normalize(): void;
  public abstract async validate(): Promise<boolean>;

  protected _validateOptions(newOptions: O | undefined): void {
    if (isUsable(newOptions)) {
      this.options = newOptions!;

      if (!isUsable(this.options.validationStopOnInvalid)) {
        this.options.validationStopOnInvalid = DEFAULT_VALIDATION_STOP_ON_INVALID;
      }
      this.options.validationWaitInterval =
        this.options.validationWaitInterval ||
        DEFAULT_VALIDATION_WAIT_INTERVAL;
      this.options.validationWaitTimeout =
        this.options.validationWaitTimeout || DEFAULT_VALIDATION_WAIT_TIMEOUT;
    } else {
      this.options = cloneDeep<O>(DEFAULT_ENTITY_OPTIONS as O);
    }
  }
}
