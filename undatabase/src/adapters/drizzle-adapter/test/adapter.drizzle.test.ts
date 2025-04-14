import type { BetterAuthOptions } from '../../../types/index.ts'
import merge from 'deepmerge'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Kysely, PostgresDialect, sql } from 'kysely'
import { Pool } from 'pg'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { drizzleAdapter } from '../index.ts'
import { betterAuth } from '../../../auth'
import { getMigrations } from '../../../db/get-migration'
import { runAdapterTest, runNumberIdAdapterTest } from '../../test.ts'
import * as schema from './schema.ts'

const TEST_DB_URL = 'postgres://user:password@localhost:5432/better_auth'

const createTestPool = () => new Pool({ connectionString: TEST_DB_URL })

function createKyselyInstance(pool: Pool) {
  return new Kysely({
    dialect: new PostgresDialect({ pool }),
  })
}

async function cleanupDatabase(postgres: Kysely<any>, shouldDestroy = true) {
  await sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`.execute(
    postgres,
  )
  if (shouldDestroy) {
    await postgres.destroy()
  }
}

function createTestOptions(pg: Pool, useNumberId = false) {
  return ({
    database: pg,
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

describe('drizzle Adapter Tests', async () => {
  let pg: Pool
  let postgres: Kysely<any>
  pg = createTestPool()
  postgres = createKyselyInstance(pg)
  const opts = createTestOptions(pg)
  await cleanupDatabase(postgres, false)
  const { runMigrations } = await getMigrations(opts)
  await runMigrations()

  afterAll(async () => {
    await cleanupDatabase(postgres)
  })
  const db = drizzle(pg)
  const adapter = drizzleAdapter(db, { provider: 'pg', schema })

  await runAdapterTest({
    getAdapter: async (customOptions = {}) => {
      const db = opts.database
      // @ts-ignore
      opts.database = undefined
      const merged = merge(opts, customOptions)
      merged.database = db
      return adapter(merged)
    },
  })
})

describe('drizzle Adapter Authentication Flow Tests', async () => {
  const pg = createTestPool()
  let postgres: Kysely<any>
  const opts = createTestOptions(pg)
  const testUser = {
    email: 'test-email@email.com',
    password: 'password',
    name: 'Test Name',
  }
  beforeAll(async () => {
    postgres = createKyselyInstance(pg)

    const { runMigrations } = await getMigrations(opts)
    await runMigrations()
  })

  const auth = betterAuth({
    ...opts,
    database: drizzleAdapter(drizzle(pg), { provider: 'pg', schema }),
    emailAndPassword: {
      enabled: true,
    },
  })

  afterAll(async () => {
    await cleanupDatabase(postgres)
  })

  it('should successfully sign up a new user', async () => {
    const user = await auth.api.signUpEmail({ body: testUser })
    expect(user).toBeDefined()
  })

  it('should successfully sign in an existing user', async () => {
    const user = await auth.api.signInEmail({ body: testUser })
    expect(user.user).toBeDefined()
  })
})

describe('drizzle Adapter Number Id Test', async () => {
  let pg: Pool
  let postgres: Kysely<any>
  pg = createTestPool()
  postgres = createKyselyInstance(pg)
  const opts = createTestOptions(pg, true)
  beforeAll(async () => {
    await cleanupDatabase(postgres, false)
    const { runMigrations } = await getMigrations(opts)
    await runMigrations()
  })

  afterAll(async () => {
    await cleanupDatabase(postgres)
  })
  const db = drizzle(pg)
  const adapter = drizzleAdapter(db, {
    provider: 'pg',
    schema,
    debugLogs: {
      isRunningAdapterTests: true,
    },
  })

  await runNumberIdAdapterTest({
    getAdapter: async (customOptions = {}) => {
      const db = opts.database
      // @ts-ignore
      opts.database = undefined
      const merged = merge(opts, customOptions)
      merged.database = db
      return adapter(merged)
    },
  })
})
