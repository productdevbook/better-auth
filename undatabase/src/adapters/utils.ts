/**
 * Utility functions for adapters
 */

import type { FieldAttribute } from "../db/index.ts";

/**
 * Applies default values for fields based on their attributes
 */
export function withApplyDefault(
  value: any, 
  fieldAttributes: FieldAttribute, 
  action: "create" | "update"
) {
  if (value === undefined && fieldAttributes.defaultValue && action === "create") {
    return fieldAttributes.defaultValue();
  }
  return value;
}