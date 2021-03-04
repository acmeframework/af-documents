export enum NumberBoundTypes {
  unbounded,
  max_safe_integer,
  infinity, // Infinity can be used as a bounds but since it is unpredictable
  // the results of isValid cannot be trusted. isValid will be no
  // more correct or wrong than standard numeric comparison
  // methods built into the Javascript core.
}

export const DEFAULT_NUMBER_MAX_VALUE = 0;
export const DEFAULT_NUMBER_MIN_VALUE = 0;
export const DEFAULT_NUMBER_BOUNDS = NumberBoundTypes.unbounded;

export const DEFAULT_NUMBER_PROPERTY_NAME = 'number_property';
