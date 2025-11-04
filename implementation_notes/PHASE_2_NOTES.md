# Phase 2: API Routes (Mock-Backed)

## Goal
Convert the data-access layer (`lib/api/`) to real HTTP endpoints using Next.js API routes, while keeping mock data as the backend. This prepares the app for Phase 3 database integration without breaking existing functionality.

## Status
**Current:** Sub-Phase 2E Complete ✅  
**Completed:** 2A ✅, 2B ✅, 2C ✅, 2D ✅, 2E ✅  
**Prerequisites:** Phase 1 Complete ✅

---

## Overview

Phase 1 built a complete frontend with components that call functions from `lib/api/` directly. Phase 2 will:

1. Create Next.js API route handlers (`app/api/`)
2. Move business logic from `lib/api/` to route handlers
3. Update components to use `fetch()` instead of direct function calls
4. Keep mock data in `lib/data/` (no database yet)
5. Maintain existing functionality - no breaking changes to UI

**Why This Matters:**
- Prepares for Phase 3 (database) - just swap mock data source
- Enables real API calls from frontend
- Better separation of concerns
- Can test API endpoints independently
- Ready for external integrations

---

## Decision Gates

**STOP AND ASK before proceeding:**

1. **API Structure:** "Should we use REST conventions (`/api/organizations`, `/api/organizations/[id]`) or a different pattern?"
2. **Error Handling:** "What HTTP status codes should we return? (200, 201, 400, 404, 500)"
3. **Response Format:** "Should all responses be JSON? Standardize format like `{ data, error }`?"
4. **Authentication:** "Should we add auth headers now or wait until Phase 4?"

---

## Sub-Phases Breakdown

### Sub-Phase 2A: API Infrastructure Setup ✅
**Goal:** Create the foundation for API routes

**Tasks:**
1. Create `app/api/` directory structure
2. Set up route handler utilities (error handling, response formatting)
3. Create TypeScript types for API responses
4. Add API client utilities (`lib/api-client.ts`) for frontend
5. Update `next.config.ts` if needed for CORS/headers

**Files to Create:**
- `app/api/organizations/route.ts` - Base route handler structure
- `app/api/organizations/[id]/route.ts` - Single org route handler
- `app/api/forums/route.ts` - Forums route handler
- `app/api/forums/[id]/route.ts` - Single forum route handler
- `app/api/forums/[id]/posts/route.ts` - Forum posts route handler
- `lib/api-client.ts` - Frontend API client helper functions
- `lib/types/api.ts` - API response types

**Tests:**
- API route handler structure tests
- Response format validation
- Error handling tests

**Dependencies:** Phase 1 Complete

---

### Sub-Phase 2B: Organizations API ✅
**Goal:** Convert organizations data access to API endpoints

**Endpoints to Create:**

1. **GET `/api/organizations`**
   - Query params: `?type=nonprofit&search=cambridge`
   - Returns: `Organization[]`
   - Uses: `getOrganizations()` from `lib/api/organizations.ts`

2. **GET `/api/organizations/[id]`**
   - Returns: `Organization | null`
   - Uses: `getOrganization()` from `lib/api/organizations.ts`

**Tasks:**
1. Create route handlers for organizations endpoints
2. Move filtering/search logic from `lib/api/organizations.ts` to route handlers
3. Create `lib/api-client/organizations.ts` client functions
4. Update `components/organizations/` to use API client instead of direct imports
5. Update `app/organizations/page.tsx` to fetch from API
6. Update `app/organizations/[id]/page.tsx` to fetch from API
7. Add loading states and error handling
8. Write API route tests

**Files to Modify:**
- `app/organizations/page.tsx` - Switch to `fetch('/api/organizations')`
- `app/organizations/[id]/page.tsx` - Switch to `fetch('/api/organizations/[id]')`
- `components/organizations/OrganizationCard.tsx` - May need updates if fetching data

**Files to Create:**
- `app/api/organizations/route.ts`
- `app/api/organizations/[id]/route.ts`
- `lib/api-client/organizations.ts`

**Tests:**
- GET `/api/organizations` returns all orgs
- GET `/api/organizations?type=nonprofit` filters correctly
- GET `/api/organizations?search=cambridge` searches correctly
- GET `/api/organizations/[id]` returns single org
- GET `/api/organizations/invalid-id` returns 404
- Error handling tests

**Dependencies:** Sub-Phase 2A

---

### Sub-Phase 2C: Forums API ✅
**Goal:** Convert forums data access to API endpoints

**Endpoints to Create:**

1. **GET `/api/forums`**
   - Returns: `Forum[]`
   - Uses: `getForums()` from `lib/api/forums.ts`

2. **GET `/api/forums/[id]`**
   - Returns: `Forum | null`
   - Uses: `getForum()` from `lib/api/forums.ts`

3. **GET `/api/forums/[id]/posts`**
   - Returns: `ForumPost[]`
   - Uses: `getForumPosts()` from `lib/api/forums.ts`

4. **GET `/api/posts/[id]/replies`**
   - Returns: `ForumReply[]`
   - Uses: `getPostReplies()` from `lib/api/forums.ts`

5. **GET `/api/activity/recent`**
   - Query params: `?limit=10`
   - Returns: `ForumPostWithForum[]`
   - Uses: `getRecentActivity()` from `lib/api/forums.ts`

6. **POST `/api/forums`**
   - Body: `{ title, description, category }`
   - Returns: `Forum`
   - Uses: `createForum()` from `lib/api/forums.ts`

**Tasks:**
1. Create route handlers for all forums endpoints
2. Move forum logic from `lib/api/forums.ts` to route handlers
3. Create `lib/api-client/forums.ts` client functions
4. Update `components/forums/` to use API client
5. Update `app/forums/page.tsx` to fetch from API
6. Update `app/dashboard/page.tsx` to fetch from API
7. Update `components/forums/CreateForumDialog.tsx` to POST to API
8. Add loading states and error handling
9. Write API route tests

**Files to Modify:**
- `app/forums/page.tsx` - Switch to API calls
- `app/dashboard/page.tsx` - Switch to API calls
- `components/forums/ForumList.tsx` - Fetch forums from API
- `components/forums/ForumDetail.tsx` - Fetch posts from API
- `components/forums/PostThread.tsx` - Fetch replies from API
- `components/forums/CreateForumDialog.tsx` - POST to API
- `components/forums/ActivityFeed.tsx` - May need updates

**Files to Create:**
- `app/api/forums/route.ts`
- `app/api/forums/[id]/route.ts`
- `app/api/forums/[id]/posts/route.ts`
- `app/api/posts/[id]/replies/route.ts`
- `app/api/activity/recent/route.ts`
- `lib/api-client/forums.ts`

**Tests:**
- GET `/api/forums` returns all forums
- GET `/api/forums/[id]` returns single forum
- GET `/api/forums/[id]/posts` returns posts
- GET `/api/posts/[id]/replies` returns replies
- GET `/api/activity/recent?limit=10` returns recent activity
- POST `/api/forums` creates new forum
- Error handling tests
- Validation tests (required fields, etc.)

**Dependencies:** Sub-Phase 2A

---

### Sub-Phase 2D: API Client Refactoring ✅
**Goal:** Consolidate API client usage across frontend

**Tasks:**
1. Create unified API client utilities (`lib/api-client.ts`)
2. Add request interceptors (for future auth headers)
3. Add error handling utilities
4. Add TypeScript types for API responses
5. Update all components to use centralized client
6. Remove direct imports from `lib/api/` in components
7. Keep `lib/api/` for internal use by route handlers only

**Files to Create:**
- `lib/api-client/index.ts` - Main API client export
- `lib/api-client/types.ts` - API response types
- `lib/api-client/utils.ts` - Helper functions

**Files to Modify:**
- All components that import from `lib/api/` → switch to `lib/api-client/`
- Keep `lib/api/` for route handlers only

**Tests:**
- API client error handling
- Request/response transformation
- Type safety tests

**Dependencies:** Sub-Phase 2B, 2C

---

### Sub-Phase 2E: Testing & Documentation ✅
**Goal:** Ensure API routes are well-tested and documented

**Tasks:**
1. Write comprehensive API route tests
2. Test error scenarios (404, 500, invalid input)
3. Test edge cases (empty arrays, null values)
4. Document API endpoints (comments or separate docs)
5. Update `NEXT_CHAT_SUMMARY.md` with API structure
6. Add API testing utilities if needed

**Tests:**
- All endpoints return correct status codes
- All endpoints handle errors gracefully
- Input validation works correctly
- Response formats are consistent

**Dependencies:** Sub-Phase 2B, 2C, 2D

---

## Implementation Strategy

### Approach: Incremental Migration

1. **Create API route alongside existing code**
   - Don't break existing functionality
   - Add new route handlers first
   - Test new routes independently

2. **Migrate one component at a time**
   - Start with simplest component (e.g., OrganizationCard)
   - Verify it works end-to-end
   - Move to next component

3. **Keep `lib/api/` functions**
   - Route handlers will call `lib/api/` functions
   - This isolates business logic
   - Makes Phase 3 migration easier (just swap data source)

4. **Use TypeScript strictly**
   - API request/response types
   - Validate at runtime if needed

---

## File Structure After Phase 2

```
cambridge-connect/
├── app/
│   ├── api/                         # NEW: API route handlers
│   │   ├── organizations/
│   │   │   ├── route.ts             # GET /api/organizations
│   │   │   └── [id]/route.ts       # GET /api/organizations/[id]
│   │   ├── forums/
│   │   │   ├── route.ts             # GET /api/forums, POST /api/forums
│   │   │   ├── [id]/route.ts       # GET /api/forums/[id]
│   │   │   └── [id]/posts/route.ts # GET /api/forums/[id]/posts
│   │   ├── posts/
│   │   │   └── [id]/replies/route.ts # GET /api/posts/[id]/replies
│   │   └── activity/
│   │       └── recent/route.ts      # GET /api/activity/recent
│   │
│   └── [existing pages...]
│
├── lib/
│   ├── api/                         # Still exists - used by route handlers
│   │   ├── organizations.ts         # Business logic (called by route handlers)
│   │   └── forums.ts                # Business logic (called by route handlers)
│   │
│   ├── api-client/                  # NEW: Frontend API client
│   │   ├── index.ts                 # Main export
│   │   ├── organizations.ts         # Frontend org API calls
│   │   ├── forums.ts                # Frontend forum API calls
│   │   └── types.ts                 # API response types
│   │
│   ├── data/                        # Mock data (still used)
│   │   ├── mockOrganizations.ts
│   │   └── mockForums.ts
│   │
│   ├── types.ts                     # TypeScript interfaces
│   └── utils.ts                     # Utility functions
│
└── tests/
    ├── api/                         # NEW: API route tests
    │   ├── organizations.test.ts
    │   └── forums.test.ts
    └── [existing tests...]
```

---

## API Design Decisions

### RESTful Conventions
- **GET** `/api/organizations` - List all (with query params for filtering)
- **GET** `/api/organizations/[id]` - Get single
- **GET** `/api/forums` - List all
- **GET** `/api/forums/[id]` - Get single
- **POST** `/api/forums` - Create new

### Response Format
```typescript
// Success response
{
  data: T | T[]
}

// Error response
{
  error: {
    message: string
    code?: string
  }
}
```

### HTTP Status Codes
- `200` - Success (GET, POST)
- `201` - Created (POST new resource)
- `400` - Bad Request (validation errors)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (unexpected errors)

### Query Parameters
- `GET /api/organizations?type=nonprofit&search=cambridge`
- `GET /api/activity/recent?limit=10`

---

## Migration Checklist

### For Each Component:

- [ ] Identify all `lib/api/` imports
- [ ] Create corresponding API client function
- [ ] Replace direct function calls with `fetch()` or API client
- [ ] Update loading states (use `useEffect` + `fetch`)
- [ ] Add error handling
- [ ] Test component still works
- [ ] Update tests if needed

### Components to Migrate:

**Organizations:**
- [ ] `app/organizations/page.tsx`
- [ ] `app/organizations/[id]/page.tsx`
- [ ] `components/organizations/OrganizationCard.tsx` (if needed)

**Forums:**
- [ ] `app/forums/page.tsx`
- [ ] `app/dashboard/page.tsx`
- [ ] `components/forums/ForumList.tsx`
- [ ] `components/forums/ForumDetail.tsx`
- [ ] `components/forums/PostThread.tsx`
- [ ] `components/forums/CreateForumDialog.tsx`
- [ ] `components/forums/ActivityFeed.tsx`
- [ ] `components/forums/PostCard.tsx`

---

## Testing Strategy

### API Route Tests
- Test route handlers directly
- Mock `lib/api/` functions
- Test request/response formats
- Test error cases

### Integration Tests
- Test components calling API endpoints
- Mock `fetch()` in tests
- Verify data flows correctly

### E2E Considerations
- Can use Playwright/Cypress if needed
- Test actual HTTP requests

---

## Phase 2 Success Criteria

✅ All data access goes through API endpoints  
✅ Components use `fetch()` or API client (not direct `lib/api/` imports)  
✅ API routes return proper HTTP status codes  
✅ Error handling works correctly  
✅ All existing functionality still works  
✅ Tests written and passing  
✅ Mock data still powers everything (no database yet)  
✅ Ready for Phase 3 (database integration)

---

## Git Commit Plan

**After Sub-Phase 2A:**
```
feat(api): setup API route infrastructure
```

**After Sub-Phase 2B:**
```
feat(api): add organizations API endpoints
```

**After Sub-Phase 2C:**
```
feat(api): add forums API endpoints
```

**After Sub-Phase 2D:**
```
refactor(api): consolidate API client usage
```

**After Sub-Phase 2E:**
```
feat(api): complete Phase 2 API routes with tests
```

**Final Phase 2 Commit:**
```
feat: phase2-api-routes-mock-backed

- Converted lib/api/ to HTTP endpoints
- Created Next.js API route handlers
- Updated components to use API client
- Added comprehensive API tests
- Maintained mock data backend (ready for Phase 3 DB)
```

---

## Next Phase Preview

**Phase 3:** Database + Prisma
- Add Prisma ORM
- Choose database (SQLite for dev, Postgres for prod?)
- Migrate mock data to database
- Update API route handlers to use database queries
- Keep same API contract (no frontend changes needed)

---

## Notes & Considerations

### Why Keep `lib/api/` Functions?
- Route handlers call `lib/api/` functions
- Business logic stays separated from HTTP concerns
- Phase 3: Just swap `lib/api/` to use database instead of mocks
- Easier to test business logic independently

### Performance Considerations
- API calls add network overhead (even local)
- Consider caching strategies if needed
- React Query or SWR could help with data fetching

### Future Enhancements
- Rate limiting
- Request validation middleware
- CORS configuration
- API versioning (`/api/v1/...`)

---

## Questions to Resolve

1. **Should we use React Query/SWR?**
   - Pros: Better caching, refetching, loading states
   - Cons: Additional dependency
   - Decision: Start with `fetch()`, add later if needed

2. **Should we add request validation?**
   - Use Zod or similar for runtime validation
   - Decision: Add basic validation, expand later

3. **Should we version APIs?**
   - `/api/v1/organizations` vs `/api/organizations`
   - Decision: Not needed yet, can add later

4. **Error handling strategy?**
   - Centralized error handler?
   - Custom error classes?
   - Decision: Start simple, refactor if needed

---

**Last Updated:** Phase 2 Planning Session  
**Status:** Ready to start Sub-Phase 2A

