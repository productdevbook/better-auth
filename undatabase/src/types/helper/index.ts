/**
 * A utility type that makes complex types easier to read in editor tooltips
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {}
