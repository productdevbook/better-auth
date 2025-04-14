# Undatabase and Better-Auth Migration Project Guide

This project involves migrating the adapter structure from the Better-Auth library to a general npm package called Undatabase. Our goal is to transform database adapters into a more general-purpose structure that is independent of Better-Auth.

## Project Structure

- **Source Project**: Better-Auth (`/packages/better-auth`)
- **Target Project**: Undatabase (`/undatabase`)

## Migration Process

The adapter structure in Better-Auth involves migrating the following files and modules to the Undatabase project:

1. `create-adapter` - Database adapter creation module
2. `db` - Database-related structures
3. Required utility functions and types

## Migration Principles

1. **ESM Support**: All code is being migrated to support the ESM module system
2. **Path Adjustments**: Import paths need to be updated to match the Undatabase project
3. **Dependency Reduction**: Better-Auth-specific dependencies should be removed or generalized

## Components to Migrate

### 1. Create-Adapter
- `index.ts` - Main adapter creator
- `types.ts` - Adapter types and interfaces
- Test files

### 2. DB
- `get-tables.ts` - Function that retrieves table structures
- `index.ts` - Main export file of the DB module

### 3. Utilities
- `json.ts` - JSON helper functions
- Other necessary utility functions

## Target Structure

The Undatabase project will contain modules organized as adapters, db, and utils. Each module will contain its necessary functions and types.

## Post-Migration Tasks

1. Remaining adapter code in Better-Auth will be deprecated
2. Better-Auth will use Undatabase as a dependency for adapters
3. All projects will use the adapter structure provided by Undatabase

## Adapter Usage

Adapters will be used in the following structure:

```typescript
import { createAdapter } from 'undatabase';

const myAdapter = createAdapter({
  config: {
    adapterId: 'my-adapter',
    // other configuration properties
  },
  adapter: (params) => {
    // adapter implementation
  }
});
```

## Test Structure

Comprehensive tests are being migrated to ensure adapters work correctly. These tests check:

1. Data transformations
2. Query building
3. Data reading and writing operations