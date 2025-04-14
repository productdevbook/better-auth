import type { Pool } from 'mysql2/promise'
import type { BetterAuthOptions } from '../../../types/index.ts'
import merge from 'deepmerge'
import { drizzle } from 'drizzle-orm/mysql2'
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2/promise'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getMigrations } from '../../../db/get-migration.ts'
import { runAdapterTest, runNumberIdAdapterTest } from '../../test.ts'
import { drizzleAdapter } from '../index.ts'
import * as schema from './schema.mysql.ts'

const TEST_DB_MYSQL_URL = 'mysql://user:password@localhost:3306/better_auth'

const createTestPool = () => createPool(TEST_DB_MYSQL_URL)

function createKyselyInstance(pool: any) {
  return new Kysely({
    dialect: new MysqlDialect({ pool }),
  })
}

async function cleanupDatabase(mysql: Pool, shouldDestroy = true) {
  try {
    await mysql.query('DROP DATABASE IF EXISTS better_auth')
    await mysql.query('CREATE DATABASE better_auth')
    await mysql.query('USE better_auth')
  }
  catch (error) {
    console.log(error)
  }
  if (shouldDestroy) {
    await mysql.end()
  }
  else {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

function createTestOptions(pool: any, useNumberId = false) {
  return ({
    database: pool,
    user: {
      fields: { email: 'email_address' },
      additionalFields: {
        test: {
          type: 'string',
          defaultValue: 'test',
        },
      },
    },
    session: {
      modelName: 'sessions',
    },
    advanced: {
      database: {
        useNumberId,
      },
    },
  }) satisfies BetterAuthOptions
}

describe('drizzle Adapter Tests (MySQL)', async () => {
  let pool: any
  let mysql: Kysely<any>

  pool = createTestPool()
  mysql = createKyselyInstance(pool)
  let opts = createTestOptions(pool)
  const { runMigrations } = await getMigrations(opts)
  await runMigrations()

  const db = drizzle({
    client: pool,
  })
  const adapter = drizzleAdapter(db, {
    provider: 'mysql',
    schema,
    debugLogs: {
      isRunningAdapterTests: true,
    },
  })

  await runAdapterTest({
    getAdapter: async (customOptions = {}) => {
      const db = opts.database
      opts.database = undefined
      const merged = merge(opts, customOptions)
      merged.database = db
      return adapter(merged)
    },
  })
})

describe('drizzle Adapter Authentication Flow Tests (MySQL)', async () => {
  const pool = createTestPool()
  const opts = createTestOptions(pool)
  const testUser = {
    email: 'test-email@email.com',
    password: 'password',
    name: 'Test Name',
  }

  beforeAll(async () => {
    const { runMigrations } = await getMigrations(opts)
    await runMigrations()
  })
})

describe('drizzle Adapter Number Id Test (MySQL)', async () => {
  let pool: any
  let mysql: Kysely<any>

  pool = createTestPool()
  mysql = createKyselyInstance(pool)
  let opts = createTestOptions(pool, true)

  beforeAll(async () => {
    await cleanupDatabase(pool, false)
    const { runMigrations } = await getMigrations(opts)
    await runMigrations()
  })

  afterAll(async () => {
    await cleanupDatabase(pool)
  })

  const db = drizzle({
    client: pool,
  })
  const adapter = drizzleAdapter(db, {
    provider: 'mysql',
    schema,
    debugLogs: {
      isRunningAdapterTests: true,
    },
  })

  await runNumberIdAdapterTest({
    getAdapter: async (customOptions = {}) => {
      const db = opts.database
      opts.database = undefined
      const merged = merge(opts, customOptions)
      merged.database = db
      return adapter(merged)
    },
  })
})
