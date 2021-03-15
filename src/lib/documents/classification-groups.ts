import { ClassificationName } from '../properties';

/**
 * A interface to describe the mapping of property classifications to group
 * names.
 *
 * @export
 * @interface ClassificationGroupParts
 */
export interface ClassificationGroupParts {
  name: string;
  parts: ClassificationName[];
}

/**
 * A mapping of classification group names to their parts. "Parts" in this
 * case refer to property classification names.
 *
 * @export
 * @constant propertyClassificationGroups
 */
export const propertyClassificationGroups: ClassificationGroupParts[] = [
  {
    name: 'address',
    parts: [
      'address_line',
      'city',
      'state_province',
      'zip_code',
      'postal_code',
      'county',
      'country',
    ],
  },
  {
    name: 'person',
    parts: [
      'name_prefix',
      'name_first',
      'name_middle',
      'name_last',
      'name_suffix',
      'date_birth',
    ],
  },
  {
    name: 'geospatial',
    parts: ['geohash', 'latitude', 'longitude'],
  },
];
