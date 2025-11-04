# Phase 3: Database + Prisma Integration

## Goal
Replace mock data with a real database using Prisma ORM. Migrate all data access to use database queries while maintaining the same API contract (no frontend changes needed).

## Status
**Current:** Sub-Phase 3G Complete ✅  
**Completed:** 3A ✅, 3B ✅, 3C ✅, 3D ✅, 3E ✅, 3F ✅, 3G ✅  
**Prerequisites:** Phase 2 Complete ✅

---

## Overview

Phase 2 built API routes that use mock data from `lib/data/`. Phase 3 will:

1. Add Prisma ORM and database (SQLite for dev, PostgreSQL for prod)
2. Define database schema matching our TypeScript types
3. Migrate mock data to database
4. Update `lib/api/` functions to use Prisma queries instead of mock data
5. Keep same API contract - no frontend changes needed
6. Add comprehensive database tests

**Why This Matters:**
- Data persists across server restarts
- Better performance with proper indexing
- Data integrity with foreign keys and constraints
- Scalable to handle large datasets
- Production-ready storage solution

---

## Decision Gates

**STOP AND ASK before proceeding:**

1. **Database Choice:** "SQLite for dev and PostgreSQL for production, or use PostgreSQL for both?"
2. **Migration Strategy:** "Should we keep mock data files for reference or remove them?"
3. **Seed Data:** "Should seed script create new data or use existing mock data?"

---

## Sub-Phases Breakdown

### Sub-Phase 3A: Prisma Setup ✅
**Goal:** Install and configure Prisma

**Tasks:**
1. Install Prisma dependencies (`prisma`, `@prisma/client`)
2. Initialize Prisma (`npx prisma init`)
3. Configure database connection
   - Development: SQLite (file-based)
   - Production: PostgreSQL (environment variable)
4. Create `.env` file with database connection string
5. Set up Prisma client singleton

**Files to Create:**
- `prisma/schema.prisma` - Database schema definition
- `.env` - Environment variables (add to .gitignore)
- `.env.example` - Example environment file
- `lib/prisma.ts` - Prisma client singleton

**Files to Modify:**
- `package.json` - Add Prisma scripts
- `.gitignore` - Add `.env` and database files

**Dependencies:** Phase 2 Complete

---

### Sub-Phase 3B: Database Schema Design ✅
**Goal:** Define database tables matching current data structures

**Tasks:**
1. Define Prisma models:
   - `Organization` model
   - `Forum` model
   - `ForumPost` model
   - `ForumReply` model
2. Define relationships:
   - Forum → Posts (one-to-many)
   - Post → Replies (one-to-many)
   - Post/Reply → Organization (via authorOrgId)
3. Add indexes for performance:
   - `forumId` on ForumPost
   - `postId` on ForumReply
   - `authorOrgId` on ForumPost and ForumReply
4. Handle array types (org types)
5. Set default values where appropriate

**Files to Create:**
- `prisma/schema.prisma` - Complete schema definition

**Files to Modify:**
- `lib/types.ts` - May need updates if schema differs

**Tests:**
- Schema validation
- Type generation check

**Dependencies:** Sub-Phase 3A

---

### Sub-Phase 3C: Migrate Mock Data to Database ✅
**Goal:** Move existing mock data into database

**Tasks:**
1. Create Prisma seed script (`prisma/seed.ts`)
2. Convert mock data from TypeScript to Prisma format
3. Run initial migration: `npx prisma migrate dev --name init`
4. Seed database: `npx prisma db seed`
5. Verify data is in database
6. Update seed script to be idempotent (can run multiple times)

**Files to Create:**
- `prisma/seed.ts` - Seed script

**Files to Modify:**
- `package.json` - Add `prisma.seed` configuration
- `lib/data/mockOrganizations.ts` - May reference for seed data
- `lib/data/mockForums.ts` - May reference for seed data

**Tests:**
- Seed script runs successfully
- Data matches expected structure
- Seed is idempotent

**Dependencies:** Sub-Phase 3B

---

### Sub-Phase 3D: Update API Layer to Use Database ✅
**Goal:** Replace mock data calls with database queries

**Tasks:**
1. Update `lib/api/organizations.ts`:
   - Replace `mockOrganizations` imports with Prisma queries
   - `getOrganizations()` → `prisma.organization.findMany()`
   - `getOrganization()` → `prisma.organization.findUnique()`
   - Update filtering to use Prisma `where` clauses
   - Update search to use Prisma `contains` filters
2. Update `lib/api/forums.ts`:
   - Replace mock data with Prisma queries
   - Use Prisma relations for posts/replies
   - Update `createForum()` to use `prisma.forum.create()`
   - Update `getRecentActivity()` to use Prisma queries with joins
   - Handle in-memory `createdForums` → database storage
3. Update sorting to use Prisma `orderBy`
4. Remove or deprecate mock data files

**Files to Modify:**
- `lib/api/organizations.ts` - Use Prisma queries
- `lib/api/forums.ts` - Use Prisma queries
- `lib/prisma.ts` - Ensure singleton is properly exported

**Files to Deprecate:**
- `lib/data/mockOrganizations.ts` - Keep for reference or remove
- `lib/data/mockForums.ts` - Keep for reference or remove

**Tests:**
- All existing API tests still pass
- Database queries return correct data
- Filtering and search work correctly

**Dependencies:** Sub-Phase 3C

---

### Sub-Phase 3E: Handle Database Operations ✅
**Goal:** Implement create/update/delete operations properly

**Tasks:**
1. Update `createForum()` to use `prisma.forum.create()`
2. Add transaction support for complex operations:
   - Creating forum with initial post
   - Updating counts (postCount, replyCount)
3. Handle errors properly:
   - Duplicate IDs
   - Foreign key constraints
   - Invalid data types
4. Add database indexes for performance
5. Implement cascade deletes (if needed)

**Files to Modify:**
- `lib/api/forums.ts` - Add transaction support
- `lib/api/organizations.ts` - Add error handling

**Tests:**
- Create operations work correctly
- Transactions handle errors properly
- Counts are updated correctly

**Dependencies:** Sub-Phase 3D

---

### Sub-Phase 3F: Testing & Validation ✅
**Goal:** Ensure everything works with database

**Tasks:**
1. Update existing tests to use test database
2. Create database reset utilities for tests
3. Test all CRUD operations
4. Verify performance (query times)
5. Test migrations (up and down)
6. Test seed script in test environment

**Files to Create:**
- `tests/setup/database.ts` - Test database utilities
- `tests/fixtures/` - Test data fixtures

**Files to Modify:**
- `tests/app/api/organizations.test.ts` - Use test database
- `tests/app/api/forums.test.ts` - Use test database
- `vitest.config.ts` - Add test database config

**Tests:**
- All existing tests pass with database
- New database-specific tests
- Performance tests

**Dependencies:** Sub-Phase 3E

---

### Sub-Phase 3G: Production Readiness ✅
**Goal:** Prepare for production deployment

**Tasks:**
1. Set up PostgreSQL connection string configuration
2. Configure environment variables properly
3. Set up database migrations for production
4. Add database connection pooling
5. Document database setup process
6. Add database backup strategy documentation

**Files to Create:**
- `.env.production.example` - Production env example
- `docs/DATABASE_SETUP.md` - Database setup documentation

**Files to Modify:**
- `.env.example` - Add production database URL
- `README.md` - Add database setup instructions

**Dependencies:** Sub-Phase 3F

---

### Sub-Phase 3H: Database Testing & Validation ✅
**Goal:** Comprehensive database testing suite

**Tasks:**
1. Set up test database configuration
2. Create database testing utilities
3. Write integration tests for database operations
4. Update existing API route tests to work with database
5. Test database migrations (up and down)
6. Test data seeding
7. Performance testing and optimization

**Files to Create:**
- `tests/lib/prisma.test.ts` - Prisma client tests
- `tests/lib/api/organizations-db.test.ts` - Database-backed organization tests
- `tests/lib/api/forums-db.test.ts` - Database-backed forum tests
- `tests/lib/api/posts-db.test.ts` - Database-backed post/reply tests
- `tests/setup/database.ts` - Test database utilities
- `tests/fixtures/` - Test data fixtures

**Files to Modify:**
- `tests/app/api/organizations.test.ts` - Update to use test database
- `tests/app/api/forums.test.ts` - Update to use test database
- `vitest.config.ts` - Update with test database config
- `package.json` - Add test database scripts

**Key Testing Areas:**

1. **Database Connection Tests**
   - Prisma client initialization
   - Connection to test database
   - Connection error handling

2. **CRUD Operation Tests**
   - Organizations: Create, Read, Update, Delete, Search, Filter
   - Forums: Create, Read, Update, Delete, Get posts
   - Posts: Create, Read, Update, Delete, Get replies
   - Replies: Create, Read, Update, Delete

3. **Relationship Tests**
   - Forum → Posts relationship
   - Post → Replies relationship
   - Cascade deletes (if implemented)
   - Foreign key constraints

4. **Query Performance Tests**
   - Search performance with indexes
   - Filter performance
   - Sorting performance
   - Pagination (if implemented)

5. **Transaction Tests**
   - Creating forum with initial post
   - Updating counts (postCount, replyCount)
   - Rollback on errors

6. **Migration Tests**
   - Migration up
   - Migration down
   - Migration with existing data
   - Seed script execution

7. **Edge Cases**
   - Empty database queries
   - Non-existent IDs (404 scenarios)
   - Invalid data types
   - Database constraint violations
   - Concurrent operations

**Test Database Setup:**
```typescript
// tests/setup/database.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export function getTestPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || 'file:./test.db',
        },
      },
    });
  }
  return prisma;
}

export async function resetTestDatabase() {
  const prisma = getTestPrismaClient();
  // Delete in reverse order of dependencies
  await prisma.forumReply.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.forum.deleteMany();
  await prisma.organization.deleteMany();
}

export async function seedTestDatabase() {
  const prisma = getTestPrismaClient();
  // Seed with test data
  // ...
}
```

**Package.json Scripts:**
```json
{
  "scripts": {
    "test:db": "TEST_DATABASE_URL=file:./test.db vitest",
    "test:db:reset": "TEST_DATABASE_URL=file:./test.db npx prisma migrate reset --force",
    "test:db:seed": "TEST_DATABASE_URL=file:./test.db npx prisma db seed"
  }
}
```

**Success Criteria:**
- ✅ All existing API route tests pass with database
- ✅ New database-specific tests cover all CRUD operations
- ✅ Test database can be reset between test runs
- ✅ Tests run in isolation (no data leakage)
- ✅ Performance tests validate query speed
- ✅ Migration tests verify up/down works correctly

**Dependencies:** Sub-Phase 3G

---

## Implementation Strategy

### Approach: Incremental Migration

1. **Set up database alongside existing code**
   - Don't break existing functionality
   - Add Prisma setup first
   - Test database connection independently

2. **Migrate one API function at a time**
   - Start with simplest (`getOrganizations` without filters)
   - Verify it works end-to-end
   - Move to next function

3. **Keep mock data temporarily**
   - Use for reference during migration
   - Remove after everything is tested
   - Can keep for seed script reference

4. **Use TypeScript strictly**
   - Prisma generates types automatically
   - Ensure types match existing interfaces
   - Update types if needed

---

## File Structure After Phase 3

```
cambridge-connect/
├── prisma/                          # NEW: Prisma schema and migrations
│   ├── schema.prisma                # Database schema definition
│   ├── seed.ts                      # Database seeding script
│   └── migrations/                  # Migration history
│
├── lib/
│   ├── api/                         # Still exists - now uses Prisma
│   │   ├── organizations.ts         # Uses prisma.organization
│   │   └── forums.ts                # Uses prisma.forum
│   │
│   ├── prisma.ts                    # NEW: Prisma client singleton
│   │
│   ├── data/                        # Deprecated - kept for reference
│   │   ├── mockOrganizations.ts    # May be used for seed script
│   │   └── mockForums.ts           # May be used for seed script
│   │
│   └── types.ts                     # TypeScript interfaces (may need updates)
│
├── tests/
│   ├── setup/
│   │   └── database.ts              # NEW: Test database utilities
│   ├── fixtures/                    # NEW: Test data fixtures
│   └── [existing tests...]
│
└── .env                             # NEW: Database connection string
```

---

## Database Schema Design Decisions

### Organization Model
- Use `id` as primary key (cuid or uuid)
- `type` as array of strings (PostgreSQL array type)
- All fields match existing TypeScript interface

### Forum Model
- Related to ForumPost via one-to-many
- Counts (`postCount`, `memberCount`, `messagesToday`) stored as fields
- `lastActivity` updated when posts are created

### ForumPost Model
- Related to Forum via `forumId` foreign key
- Related to ForumReply via one-to-many
- `authorOrgId` references Organization (but not foreign key yet - Phase 4)

### ForumReply Model
- Related to ForumPost via `postId` foreign key
- `authorOrgId` references Organization (but not foreign key yet - Phase 4)

---

## Migration Checklist

### For Each API Function:

- [ ] Identify all mock data usage
- [ ] Create equivalent Prisma query
- [ ] Test query returns same data structure
- [ ] Update filtering/search logic
- [ ] Test with real database
- [ ] Update tests if needed
- [ ] Remove mock data dependency

### Functions to Migrate:

**Organizations:**
- [ ] `getOrganizations()` - with filters and search
- [ ] `getOrganization()` - single organization

**Forums:**
- [ ] `getForums()` - list all forums
- [ ] `getForum()` - single forum
- [ ] `getForumPosts()` - posts for forum
- [ ] `getPost()` - single post
- [ ] `getPostReplies()` - replies for post
- [ ] `getRecentActivity()` - recent posts with forum info
- [ ] `createForum()` - create new forum

---

## Testing Strategy

### Database Tests
- Test Prisma client directly
- Test each API function with database
- Test relationships and joins
- Test error cases

### Integration Tests
- Test API routes → database flow
- Test complex queries
- Test transactions

### Performance Tests
- Query performance benchmarks
- Index effectiveness
- Large dataset handling

---

## Phase 3 Success Criteria

✅ All data access uses database (no mock data)  
✅ All existing API routes work correctly  
✅ All existing tests pass  
✅ Database migrations work correctly  
✅ Seed script populates database  
✅ Performance is acceptable  
✅ Production database configuration ready  
✅ Comprehensive test coverage  

---

## Next Phase Preview

**Phase 4:** Authentication + Organization Context
- Add user authentication
- Tie users to organizations
- Protect routes based on auth
- User profile management

---

## Notes & Considerations

### Why Keep `lib/api/` Functions?
- Route handlers call `lib/api/` functions
- Business logic stays separated from HTTP concerns
- Phase 3: Just swap `lib/api/` to use database instead of mocks
- Easier to test business logic independently

### Performance Considerations
- Add database indexes for frequently queried fields
- Use Prisma's query optimization features
- Consider pagination for large result sets
- Monitor query performance

### Data Migration Strategy
- Start with fresh database for development
- Seed script uses existing mock data
- Production migration will need careful planning

---

## Questions to Resolve

1. **Database choice for production?**
   - SQLite: Simple, but limited for production
   - PostgreSQL: Recommended for production
   - Decision: SQLite for dev, PostgreSQL for prod

2. **Keep mock data files?**
   - Pros: Reference for seed script, fallback
   - Cons: Can cause confusion
   - Decision: Keep for seed script reference, mark as deprecated

3. **How to handle array types?**
   - PostgreSQL: Native array support
   - SQLite: JSON string
   - Decision: Use Prisma's native array support

---

**Last Updated:** Phase 3 Planning Session  
**Status:** Ready to start Sub-Phase 3A

