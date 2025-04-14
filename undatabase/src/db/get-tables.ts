/**
 * Core database schema definition types and functions
 */

import type { BetterAuthOptions } from '../types/index.ts'

export interface TableSchema {
  modelName: string
  fields: Record<string, any>
}

export type BetterAuthDbSchema = Record<string, TableSchema>

/**
 * Gets the database tables based on the provided options
 */
export function getAuthTables(options: BetterAuthOptions = {}): BetterAuthDbSchema {
  // Default user schema
  const tables: BetterAuthDbSchema = {
    user: {
      modelName: options.user?.modelName || 'user',
      fields: {
        name: {
          type: 'string',
          fieldName: options.user?.fields?.name || 'name',
        },
        email: {
          type: 'string',
          unique: true,
          fieldName: options.user?.fields?.email || 'email',
        },
        emailVerified: {
          type: 'boolean',
          defaultValue: () => false,
          fieldName: options.user?.fields?.emailVerified || 'emailVerified',
        },
        image: {
          type: 'string',
          fieldName: options.user?.fields?.image || 'image',
        },
        createdAt: {
          type: 'date',
          defaultValue: () => new Date(),
          fieldName: options.user?.fields?.createdAt || 'createdAt',
        },
        updatedAt: {
          type: 'date',
          defaultValue: () => new Date(),
          fieldName: options.user?.fields?.updatedAt || 'updatedAt',
        },
        ...options.user?.additionalFields,
      },
    },
    session: {
      modelName: options.session?.modelName || 'session',
      fields: {
        userId: {
          type: 'string',
          references: {
            table: 'user',
            field: 'id',
          },
          fieldName: options.session?.fields?.userId || 'userId',
        },
        expires: {
          type: 'date',
          fieldName: options.session?.fields?.expires || 'expires',
        },
        sessionToken: {
          type: 'string',
          unique: true,
          fieldName: options.session?.fields?.sessionToken || 'sessionToken',
        },
        ...options.session?.additionalFields,
      },
    },
  }

  return tables
}
