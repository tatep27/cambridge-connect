# Phase 2 → Phase 3: What Changed?

## Overview

**Phase 2:** API Routes with Mock Data Backend  
**Phase 3:** Database + Prisma Integration

The main difference is **where data comes from**:
- **Phase 2:** Data stored in TypeScript arrays (`lib/data/mockOrganizations.ts`, `lib/data/mockForums.ts`)
- **Phase 3:** Data stored in SQLite database accessed via Prisma ORM

---

## Architecture Changes

### Phase 2 Architecture
```
Frontend Components
    ↓ (HTTP requests)
API Client (lib/api-client/)
    ↓ (fetch calls)
Next.js API Routes (app/api/)
    ↓ (function calls)
Data Access Layer (lib/api/)
    ↓ (reads from)
Mock Data Files (lib/data/)
```

### Phase 3 Architecture
```
Frontend Components
    ↓ (HTTP requests)
API Client (lib/api-client/)
    ↓ (fetch calls)
Next.js API Routes (app/api/)
    ↓ (function calls)
Data Access Layer (lib/api/)
    ↓ (Prisma queries)
Database (SQLite via Prisma)
```

**Key Change:** The data access layer (`lib/api/`) now queries a database instead of reading from mock data files.

---

## Data Storage

### Phase 2: In-Memory Mock Data
- Data stored in TypeScript files:
  - `lib/data/mockOrganizations.ts` - Array of 8 organizations
  - `lib/data/mockForums.ts` - Arrays of forums, posts, replies
- Data **lost** on server restart
- Data **static** - changes only in code
- `createForum()` stored new forums in memory array (`createdForums`)

### Phase 3: Database Storage
- Data stored in SQLite database file (`prisma/dev.db`)
- Data **persists** across server restarts
- Data **dynamic** - can be modified via API
- `createForum()` stores new forums in database
- Mock data files still exist but are **only used for seeding**

---

## Code Changes

### Files Modified

#### `lib/api/organizations.ts`
**Phase 2:**
```typescript
import { mockOrganizations } from "../data/mockOrganizations";

export async function getOrganizations(filters?: OrganizationFilters) {
  let results = [...mockOrganizations];
  // Filter and search in-memory array
  return results;
}
```

**Phase 3:**
```typescript
import { prisma } from "../prisma";
import { prismaOrgToTypeScript } from "../db-transformers";

export async function getOrganizations(filters?: OrganizationFilters) {
  const orgs = await prisma.organization.findMany({
    where: { /* Prisma filters */ },
    orderBy: { name: 'asc' },
  });
  return orgs.map(prismaOrgToTypeScript);
}
```

#### `lib/api/forums.ts`
**Phase 2:**
```typescript
import { mockForums, mockPosts, mockReplies } from "../data/mockForums";
let createdForums: Forum[] = []; // In-memory storage

export async function getForums() {
  return [...mockForums, ...createdForums];
}
```

**Phase 3:**
```typescript
import { prisma } from "../prisma";
import { prismaForumToTypeScript } from "../db-transformers";

export async function getForums() {
  const forums = await prisma.forum.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return forums.map(prismaForumToTypeScript);
}
```

**Removed:** `let createdForums: Forum[] = []` - no longer needed!

---

## New Files Created in Phase 3

### Database Schema & Configuration
- `prisma/schema.prisma` - Database schema definition
- `prisma/seed.ts` - Script to populate database with mock data
- `.env.example` - Database connection string template

### Database Utilities
- `lib/prisma.ts` - Prisma Client singleton
- `lib/db-transformers.ts` - Convert between Prisma types ↔ TypeScript types
- `lib/db-helpers.ts` - Helper functions (JSON serialization, date formatting)
- `lib/db-operations.ts` - Transaction utilities (createForumWithPost, recalculateCounts)

### Testing
- `tests/setup/database.ts` - Database test utilities (reset, seed, verify)
- `tests/lib/api/database-integration.test.ts` - 17 new integration tests
- `tests/lib/db-operations.test.ts` - Transaction operation tests

---

## New Capabilities

### Phase 2 Limitations
- ❌ Data lost on restart
- ❌ No data persistence
- ❌ Manual array manipulation
- ❌ No relationships enforced
- ❌ No transactions

### Phase 3 Additions
- ✅ **Data Persistence** - Data survives server restarts
- ✅ **Database Queries** - Efficient filtering, searching, sorting
- ✅ **Relationships** - Foreign keys enforce data integrity
- ✅ **Transactions** - Atomic operations (create forum + post together)
- ✅ **Count Updates** - Automatic recalculation of postCount, replyCount
- ✅ **Migrations** - Version-controlled schema changes
- ✅ **Seeding** - Reproducible test data setup

---

## API Contract (Unchanged!)

**Important:** The API contract stayed the same! No frontend changes needed.

Both phases expose the same endpoints:
- `GET /api/organizations` - Returns organizations
- `GET /api/organizations/[id]` - Returns single organization
- `GET /api/forums` - Returns forums
- `POST /api/forums` - Creates forum
- etc.

The **response format** is identical - only the **data source** changed.

---

## Testing Changes

### Phase 2 Tests
- Tests mocked data access functions
- Tests verified array manipulation logic
- Mock data files were the source of truth

### Phase 3 Tests
- Tests query actual database
- Tests verify Prisma queries work correctly
- Tests verify data transformations (Prisma ↔ TypeScript)
- Tests verify transactions and error handling
- **178 tests** passing (up from ~156)

---

## Dependencies Added

### New npm packages:
```json
{
  "dependencies": {
    "@prisma/client": "^6.18.0"  // Prisma client
  },
  "devDependencies": {
    "prisma": "^6.18.0",         // Prisma CLI
    "tsx": "^4.20.6"             // For running seed script
  }
}
```

### New scripts in `package.json`:
```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "prisma db seed",
    "postinstall": "prisma generate"
  }
}
```

---

## Data Flow Example

### Phase 2: Getting Organizations
1. Component calls `getOrganizations()` from API client
2. API client makes HTTP request to `/api/organizations`
3. API route calls `getOrganizations()` from `lib/api/organizations.ts`
4. Function reads from `mockOrganizations` array
5. Returns data (lost on restart)

### Phase 3: Getting Organizations
1. Component calls `getOrganizations()` from API client
2. API client makes HTTP request to `/api/organizations`
3. API route calls `getOrganizations()` from `lib/api/organizations.ts`
4. Function executes `prisma.organization.findMany()`
5. Prisma queries SQLite database
6. Returns data (persists across restarts)

---

## Summary

| Aspect | Phase 2 | Phase 3 |
|--------|---------|---------|
| **Data Storage** | TypeScript arrays | SQLite database |
| **Data Persistence** | ❌ Lost on restart | ✅ Persists |
| **Data Source** | Mock files | Database via Prisma |
| **Create Operations** | In-memory array | Database insert |
| **Query Performance** | Array filtering | Database indexes |
| **Relationships** | Manual checks | Foreign keys |
| **Transactions** | ❌ No | ✅ Yes |
| **Migrations** | ❌ No | ✅ Yes |
| **Frontend Changes** | ✅ None required | ✅ None required |
| **API Contract** | Same | Same |

**Bottom Line:** Phase 3 replaced mock data with a real database while maintaining the same API contract. The frontend didn't need any changes - it's all transparent!

