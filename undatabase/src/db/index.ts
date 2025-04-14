/**
 * Database-related types and functions
 * Exports field attributes and table schema functionality
 */
export interface FieldAttribute {
  type: string
  unique?: boolean
  required?: boolean
  fieldName?: string
  defaultValue?: () => any
  references?: {
    table?: string
    model?: string
    field: string
  }
  transform?: {
    input?: (value: any) => any
    output?: (value: any) => any
  }
  bigint?: boolean
}

export * from "./get-tables.ts";
