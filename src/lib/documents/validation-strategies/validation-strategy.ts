import { isUsable } from "af-conditionals";
import cloneDeep from "lodash/cloneDeep";

import {
  DEFAULT_ENTITY_OPTIONS,
  DEFAULT_VALIDATION_STOP_ON_INVALID,
  DEFAULT_VALIDATION_WAIT_INTERVAL,
  DEFAULT_VALIDATION_WAIT_TIMEOUT,
  EntityOptions,
} from "../../entity";
import { Document, DocumentOptions } from "../document";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ValidationStrategyOptions extends EntityOptions {}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

export abstract class ValidationStrategy<
  T extends Record<string, any> = Record<string, any>,
  O extends ValidationStrategyOptions = ValidationStrategyOptions
> {
  protected options!: O;
  protected validating = false;

  constructor(parent?: Document, newOptions?: O) {
    this._validateOptions(newOptions);

    // We always prefer parent options if available...
    if (isUsable(parent)) {
      const parentOptions = parent!.getOptions();

      this.options.validationWaitTimeout = this._getParentOption(
        parentOptions,
        "validationWaitTimeout"
      );
      this.options.validationWaitInterval = this._getParentOption(
        parentOptions,
        "validationWaitInterval"
      );
      this.options.validationStopOnInvalid = this._getParentOption(
        parentOptions,
        "validationStopOnInvalid"
      );
    }
  }

  public getOptions(): O {
    return cloneDeep(this.options);
  }

  public isValidating(): boolean {
    return this.validating;
  }

  public async validate(data: T): Promise<boolean> {
    if (this.isValidating()) {
      throw new Error(
        "A call to validate was made while validation is " +
          "already running for this validation strategy."
      );
    }
    this.validating = true;
    try {
      return await this._validate(data);
    } finally {
      this.validating = false;
    }
  }

  protected abstract _validate(date: T): Promise<boolean>;

  protected _getParentOption(
    parentOptions: DocumentOptions,
    optionName: string
  ): any {
    // Since we only get here via a call from our constructor, and that means
    // our parent, a Document, has already initialized, then the parentOptions
    // parameter is going to be fully populated. Therefore, we should only get
    // valid field names here - unless the developer made a mistake in which a
    // application fault is expected. Yes, someone could call this with a
    // partial parentOptions, that again is a developer mistake.
    return (parentOptions as Record<string, any>)[optionName];
  }

  protected _validateOptions(newOptions: O | undefined): void {
    if (isUsable(newOptions)) {
      this.options = newOptions!;

      if (!isUsable(this.options.validationStopOnInvalid)) {
        this.options.validationStopOnInvalid = DEFAULT_VALIDATION_STOP_ON_INVALID;
      }
      this.options.validationWaitInterval =
        this.options.validationWaitInterval || DEFAULT_VALIDATION_WAIT_INTERVAL;
      this.options.validationWaitTimeout =
        this.options.validationWaitTimeout || DEFAULT_VALIDATION_WAIT_TIMEOUT;
    } else {
      this.options = cloneDeep(DEFAULT_ENTITY_OPTIONS as O);
    }
  }
}
