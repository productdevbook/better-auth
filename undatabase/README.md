# undatabase Adapters

Database adapters for the undatabase authentication system. This package provides a collection of adapters that allow undatabase to work with various database systems.

## Installation

```bash
# Using npm
npm install undatabase

# Using yarn
yarn add undatabase

# Using pnpm
pnpm add undatabase
```

## Available Adapters

This package includes the following adapters:

- **Memory Adapter**: In-memory adapter ideal for development and testing
- **Prisma Adapter**: For [Prisma ORM](https://www.prisma.io/)
- **MongoDB Adapter**: For [MongoDB](https://www.mongodb.com/)
- **Drizzle Adapter**: For [Drizzle ORM](https://orm.drizzle.team/)
- **Kysely Adapter**: For [Kysely](https://kysely.dev/) SQL query builder

## Usage

Import and use the adapter that matches your database solution:

```typescript
import { PrismaClient } from '@prisma/client'
import { prismaAdapter, undatabase } from 'undatabase'

const prisma = new PrismaClient()

const auth = undatabase({
  // Your undatabase configuration
  adapter: prismaAdapter(prisma, {
    provider: 'postgresql',
    debugLogs: false,
  }),
})
```

## Adapter Specific Configuration

### Prisma Adapter

```typescript
import { PrismaClient } from '@prisma/client'
import { prismaAdapter } from 'undatabase'

const prisma = new PrismaClient()

const adapter = prismaAdapter(prisma, {
  // The database provider used by Prisma
  provider: 'postgresql', // 'mysql' | 'sqlite' | 'sqlserver' | 'cockroachdb' | 'mongodb'

  // If your database tables are plural (e.g., "users" instead of "user")
  usePlural: false,

  // Enable debug logs
  debugLogs: false,
})
```

### MongoDB Adapter

```typescript
import { MongoClient } from 'mongodb'
import { mongodbAdapter } from 'undatabase'

const client = new MongoClient('mongodb://localhost:27017')
await client.connect()

const adapter = mongodbAdapter(client, {
  // The name of the database to use
  databaseName: 'undatabase',

  // If your collections are plural (e.g., "users" instead of "user")
  usePlural: false,

  // Enable debug logs
  debugLogs: false,
})
```

### Drizzle Adapter

```typescript
import { drizzleAdapter } from 'undatabase';
import { drizzle } from 'drizzle-orm/...';
import * as schema from './schema';

const db = drizzle(...);

const adapter = drizzleAdapter(db, {
  // Your schema object (optional if db._ has fullSchema)
  schema,

  // The database provider
  provider: 'pg', // 'mysql' | 'sqlite'

  // If your tables are plural (e.g., "users" instead of "user")
  usePlural: false,

  // Enable debug logs
  debugLogs: false,
});
```

### Kysely Adapter

```typescript
import { kysely } from 'undatabase';
import { Kysely } from 'kysely';

const db = new Kysely<Database>({...});

const adapter = kysely(db, {
  // If your tables are plural (e.g., "users" instead of "user")
  usePlural: false,

  // Enable debug logs
  debugLogs: false,
});
```

### Memory Adapter

```typescript
import { memoryAdapter } from 'undatabase'

const adapter = memoryAdapter({
  // Optional initial data to populate the adapter with
  initialData: {
    user: [
      { id: '1', name: 'John Doe', email: 'john@example.com' }
    ]
  },

  // Enable debug logs
  debugLogs: false,
})
```

## Creating Custom Adapters

You can create custom adapters for any database system using the `createAdapter` utility:

```typescript
import { createAdapter } from 'undatabase'

export function myCustomAdapter(client, config = {}) {
  return createAdapter({
    config: {
      adapterId: 'my-custom-adapter',
      adapterName: 'My Custom Adapter',
      usePlural: config.usePlural ?? false,
      debugLogs: config.debugLogs ?? false,
    },
    // ...existing code...
  })
}
```

## Testing Adapters

This package includes utilities for testing adapters to ensure they meet the requirements:

```typescript
import { runAdapterTest } from 'undatabase/test'
import { myCustomAdapter } from './my-custom-adapter'

describe('My Custom Adapter Tests', async () => {
  // Set up your test environment...

  await runAdapterTest({
    getAdapter: async (customOptions = {}) => {
      // Return your adapter instance
      return myCustomAdapter(client, {
        ...customOptions,
        debugLogs: { isRunningAdapterTests: true }
      })
    },
    hooks: {
      beforeEach: async () => {
        // Optional setup before each test
      },
      afterAll: async () => {
        // Optional cleanup after all tests
      }
    }
  })
})
```

## License

MIT
