/**
 * Basic database field attribute definition
 */
export interface FieldAttribute {
  type: string;
  unique?: boolean;
  required?: boolean;
  fieldName?: string;
  defaultValue?: () => any;
  references?: {
    model: string;
    field: string;
  };
  transform?: {
    input?: (value: any) => any;
    output?: (value: any) => any;
  };
  bigint?: boolean;
}