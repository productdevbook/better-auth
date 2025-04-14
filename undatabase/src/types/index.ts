/**
 * Core types for the adapter functionality
 */

export interface Where {
  field: string;
  value: any;
  operator?: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'ncontains' | 'icontains' | 'starts_with' | 'ends_with';
  connector?: 'AND' | 'OR';
}

export interface BetterAuthOptions {
  advanced?: {
    database?: {
      useNumberId?: boolean;
      generateId?: (options: { model: string }) => string;
      defaultFindManyLimit?: number;
    };
    generateId?: (options: { model: string }) => string;
  };
  secondaryStorage?: any;
  session?: {
    storeSessionInDatabase?: boolean;
  };
  rateLimit?: {
    enabled?: boolean;
    storage?: 'database';
    modelName?: string;
    fields?: {
      key?: string;
      count?: string;
      lastRequest?: string;
    };
  };
  user?: {
    additionalFields?: Record<string, any>;
    fields?: Record<string, string>;
    modelName?: string;
  };
}

export interface AdapterSchemaCreation {
  content?: string;
  relativePath?: string;
}

export interface Adapter {
  create: <T extends Record<string, any>, R = T>({
    data,
    model,
    select,
  }: {
    model: string;
    data: T;
    select?: string[];
  }) => Promise<R>;
  
  update: <T>({
    model,
    where,
    update,
  }: {
    model: string;
    where: Where[];
    update: Record<string, any>;
  }) => Promise<T | null>;
  
  updateMany: ({
    model,
    where,
    update,
  }: {
    model: string;
    where: Where[];
    update: Record<string, any>;
  }) => Promise<number>;
  
  findOne: <T extends Record<string, any>>({
    model,
    where,
    select,
  }: {
    model: string;
    where: Where[];
    select?: string[];
  }) => Promise<T | null>;
  
  findMany: <T extends Record<string, any>>({
    model,
    where,
    limit,
    sortBy,
    offset,
  }: {
    model: string;
    where?: Where[];
    limit?: number;
    sortBy?: { field: string; direction: "asc" | "desc" };
    offset?: number;
  }) => Promise<T[]>;
  
  delete: ({
    model,
    where,
  }: {
    model: string;
    where: Where[];
  }) => Promise<void>;
  
  deleteMany: ({
    model,
    where,
  }: {
    model: string;
    where: Where[];
  }) => Promise<number>;
  
  count: ({
    model,
    where,
  }: {
    model: string;
    where?: Where[];
  }) => Promise<number>;
  
  createSchema?: (props: {
    file?: string;
    tables: any;
  }) => Promise<AdapterSchemaCreation>;
  
  options?: {
    adapterConfig?: any;
    [key: string]: any;
  };
  
  id: string;
}