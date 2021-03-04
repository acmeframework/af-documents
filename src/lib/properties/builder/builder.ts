import { isUsable } from 'af-conditionals';

import { ImmutableProperty } from '../immutable-property';
import { Property } from '../property';
import {
  propertyAliasMap,
  propertyClassificationMap,
  PropertyDescription,
  PropertyMap,
} from './describe-property';

export function getPropertyDescription(
  propertyName: string,
  aliasMap?: PropertyMap
): PropertyDescription | undefined {
  if (!isUsable(propertyName)) return undefined;

  propertyName = propertyName.toLocaleLowerCase();
  const propertyType = isUsable(aliasMap)
    ? aliasMap![propertyName] || propertyAliasMap[propertyName]
    : propertyAliasMap[propertyName];
  return propertyClassificationMap[propertyType];
}

export function propertyBuilder(
  value: any, // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
  propertyName: string,
  displayName?: string,
  aliasMap?: PropertyMap
): Property | ImmutableProperty | undefined {
  const propertyDescription = getPropertyDescription(propertyName, aliasMap);
  if (isUsable(propertyDescription)) {
    propertyDescription!.options.name = propertyName;
    return propertyDescription!.factory(
      value,
      propertyName,
      displayName,
      undefined,
      propertyDescription!.options
    );
  }
  return undefined;
}
