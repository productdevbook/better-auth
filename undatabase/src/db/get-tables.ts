/**
 * Core database schema definition types
 */
export interface TableSchema {
  modelName: string;
  fields: Record<string, any>;
}

export type BetterAuthDbSchema = Record<string, TableSchema>;