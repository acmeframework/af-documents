import { isArray, isObject, isString, isUsable } from "af-conditionals";

import { Entity, EntityOptions } from "..";
import {
  Property,
  propertyAliasMap,
  propertyBuilder,
  PropertyMap,
  stringPropertyFactory,
} from "../properties";
import {
  SequentialValidationStrategy,
  ValidationStrategy,
} from "./validation-strategies";

export interface DocumentOptions extends EntityOptions {
  validationStrategy?: ValidationStrategy;
}

export type DocumentEntity = Entity | Entity[];

/*
export interface DocumentEntities<D extends DocumentEntity = DocumentEntity> {
  [propName: string]: D;
}
*/

export class Document<
  D extends DocumentEntity = DocumentEntity,
  T extends Record<string, D> = Record<string, D>,
  O extends DocumentOptions = DocumentOptions
> extends Entity<T, O> {
  protected unknownProperties: string[] = [];

  constructor(
    rawData: string | object, // eslint-disable-line @typescript-eslint/ban-types
    newOptions?: O,
    protected aliasMap?: PropertyMap
  ) {
    super(newOptions);

    if (!isUsable(rawData)) {
      throw new TypeError("rawData is not usable.");
    }

    this.aliasMap = this.aliasMap || propertyAliasMap;

    if (isString(rawData)) {
      this.buildFromJSON(rawData as string);
    } else if (isObject(rawData)) {
      this.buildFromObject(rawData as object); // eslint-disable-line @typescript-eslint/ban-types
    } else {
      throw new TypeError("rawData not an acceptable type.");
    }
  }

  public getEntity(entityName: keyof T): D {
    return this.data![entityName];
  }

  public getEntities(entityNames: (keyof T)[] = []): T {
    if (entityNames.length === 0) return this.data!;

    const result = {} as T;
    entityNames.forEach((key: keyof T) => {
      const prop = this.getEntity(key);
      if (isUsable(prop)) (result[key] as D) = prop;
    });

    return result;
  }

  public getEntityValue(entityName: keyof T): any {
    const prop = this.getEntity(entityName);
    if (isUsable(prop)) {
      if (prop instanceof Property) {
        return prop.value;
      }
      return prop;
    }
    return undefined;
  }

  public isValidating(): boolean {
    return this.validating;
  }

  public normalize(): void {
    this.normalizing = true;
    try {
      const objKeys = Object.keys(this.data!);
      for (const key of objKeys) {
        const entity = this.data![key];
        this._normalize([entity as Entity]);
      }
    } finally {
      this.normalizing = false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public setEntityValue(entityName: keyof T, value: any): void {
    const prop = this.getEntity(entityName);
    if (isUsable(prop)) {
      if (prop instanceof Property) {
        prop.value = value;
      } else {
        this.data![entityName] = value;
      }
    } else {
      throw new TypeError(
        "entityName references an unknown " + "entity (" + entityName + ")."
      );
    }
  }

  public toString(): string {
    return JSON.stringify(this.data);
  }

  public async validate(): Promise<boolean> {
    if (this.validating) {
      throw new Error(
        "A call to validate was made while validation is " +
          "already running for this document."
      );
    }
    // Unlike our Property objects, there are multiple paths to change
    // values within a Document which would be expensive to watch with
    // little value. Therefore, we always run the validation routines,
    // worst case, each Property short-circuits their evaluation and we
    // simply have a short-run tight loop.
    this.validating = true;
    try {
      return await this._validate();
    } finally {
      this.validating = false;
    }
  }

  protected _normalize(entities: Entity[]): void {
    entities.forEach((entity) => {
      if (entity instanceof Entity) {
        entity.normalize();
      } else {
        // It can only be an array, since that is all we build
        // entities and arrays.
        this._normalize(entity);
      }
    });
  }

  protected async _validate(): Promise<boolean> {
    return await this.options.validationStrategy!.validate(this.data as T);
  }

  /**
   * @description Using the input string data, parse the string as a JSON
   * string and then call buildFromObject to convert the JSON into an actual
   * Document instance with properties.
   * @protected
   * @param {string} rawData
   * @memberof Document
   * @throws SyntaxError if the rawData is not a valid JSON
   */
  protected buildFromJSON(rawData: string): void {
    const parsedData = JSON.parse(rawData);
    this.buildFromObject(parsedData);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected _buildEntity(key: keyof T, value: any): D {
    let prop: Entity | Entity[];
    if (isObject(value)) {
      prop = new Document(value, this.options, this.aliasMap);
    } else if (isArray(value)) {
      const entities: Entity[] = [];
      (value as Record<string, any>).forEach((rawEntity: any) => {
        let newEntity: D | undefined;
        if (isObject(rawEntity)) {
          // We potentially have another document or property. We need to dig
          // deeper into the object to determine. If we have more than a
          // single key within the object, then we assume a document,
          // otherwise it is most likely a property. Of course, a single key,
          // but its value is not a string, number, or boolean, then we have a
          // document again.
          const keys = Object.keys(rawEntity as Record<string, any>);
          if (keys.length > 1) {
            // We most likely have a document...
            newEntity = this._buildEntity(key, rawEntity);
          } else {
            const keyName = keys[0];
            const entityValue: any = rawEntity[keyName];
            newEntity = this._buildEntity(keyName, entityValue);
          }
        } else {
          newEntity = this._buildEntity(key, rawEntity);
        }
        entities.push(newEntity as Entity);
      });
      prop = entities;
    } else {
      prop = propertyBuilder(
        value,
        key as string,
        undefined,
        this.aliasMap
      ) as Entity;
      if (!isUsable(prop)) {
        this.unknownProperties.push(key as string);
        prop = stringPropertyFactory(value, key as string);
      }
    }
    return prop as D;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  protected buildFromObject(rawData: object): void {
    this.data = {} as T;
    const objKeys = Object.keys(rawData as Record<string, any>);
    for (const key of objKeys) {
      const value: any = (rawData as Record<string, any>)[key];
      const prop = this._buildEntity(key, value);
      (this.data as Record<string, any>)[key] = prop!;
    }
  }

  protected _validateOptions(newOptions: O | undefined): void {
    super._validateOptions(newOptions);

    if (isUsable(newOptions) && isUsable(newOptions!.validationStrategy)) {
      this.options.validationStrategy = newOptions!.validationStrategy;
    } else {
      this.options.validationStrategy = new SequentialValidationStrategy(this);
    }
  }
}
