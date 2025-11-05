# Phase 4: Auth + Org Context

## Goal
Implement user authentication and link users to organizations. Enable protected routes, user profiles, and organization-based access control.

## Status
**Current:** Not Started ⏳  
**Completed:** None  
**Prerequisites:** Phase 3 Complete ✅

---

## Overview

Phase 3 integrated the database with Prisma. Phase 4 will:

1. Add NextAuth.js for authentication
2. Create User model and link to Organization
3. Build login/signup pages
4. Add session management and protected routes
5. Update existing features to use authenticated users
6. Add user profile management
7. Protect API routes that require authentication

**Why This Matters:**
- Users can create accounts and log in
- Posts/replies are tied to real users
- Organizations can manage their profiles
- Secure access to protected features
- Foundation for future features (notifications, permissions, etc.)

---

## Decision Gates

**DECISIONS MADE ✅**

1. **Authentication Method:** ✅ **Email/password only** (no OAuth providers)
   - Start simple, can add OAuth later if needed
   - Use bcrypt for password hashing

2. **User-Org Relationship:** ✅ **One user = one organization, multiple users per org**
   - Each user belongs to exactly one organization
   - Multiple users can belong to the same organization
   - Standard one-to-many relationship: `Organization.users[]` ← `User.organizationId`

3. **Registration:** ✅ **Open registration** (anyone can sign up)
   - No invite codes required
   - No admin approval needed
   - User creates account with email/password/name only
   - Organization selection happens after signup during onboarding

4. **Onboarding Flow:** ✅ **Required two-step process**
   - Step 1: User signs up (email, password, name only)
   - Step 2: User completes onboarding (join existing org OR create new org)
   - Onboarding is **required** - users cannot skip it
   - Organization is **locked** after onboarding - users cannot change their organization
   - Organization creation form fields:
     - **Required:** name, type, description, contactInternal (preferred contact for people reaching out)
     - **Optional:** website, email
     - **Not required initially:** currentNeedsInternal, resourcesOffered, location (can be added later)
   - Users without an organization are redirected to `/onboarding` until they complete it

5. **Protected Routes:** ✅ **Public: Organizations list only**
   - **Public (no auth required):**
     - `/organizations` - View organizations list (GET `/api/organizations`)
   - **Requires Authentication (everything else):**
     - `/dashboard` - Dashboard and all features
     - `/forums` - Viewing forums, posts, and replies
     - `/organizations/[id]` - Individual organization profiles
     - `/profile` - User profile page
     - `/settings` - Settings page
     - `/onboarding` - Onboarding flow (requires auth, but allows users without orgs)
     - `/login` and `/signup` - Auth pages (redirect if already logged in and has org)
     - All API endpoints except `/api/organizations` GET
   - **Rationale:** Protects community content, ensures posts/replies are tied to authenticated users, simplifies permissions

---

## Sub-Phases Breakdown

### Sub-Phase 4A: NextAuth Setup
**Goal:** Install and configure NextAuth.js

**Tasks:**
1. Install NextAuth.js (`next-auth@beta` for App Router)
2. Create NextAuth configuration file
3. Set up environment variables (NEXTAUTH_SECRET, NEXTAUTH_URL)
4. Create NextAuth API route handler (`app/api/auth/[...nextauth]/route.ts`)
5. Configure credentials provider (email/password authentication)
6. Set up session strategy (JWT or database)

**Files to Create:**
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `lib/auth.ts` or `lib/auth.config.ts` - NextAuth configuration
- `.env.example` - Add NEXTAUTH_SECRET, NEXTAUTH_URL

**Files to Modify:**
- `package.json` - Add next-auth dependency
- `.env` - Add NextAuth environment variables

**Testing:**
- Test NextAuth API route handler is accessible
- Test NextAuth configuration loads correctly
- Test environment variables are set correctly

**Dependencies:** Phase 3 Complete

**Estimated Time:** 1-2 hours

---

### Sub-Phase 4B: User & Organization Schema
**Goal:** Add User model and link to Organization

**Tasks:**
1. Add User model to Prisma schema:
   - id, email, name, emailVerified
   - password (hashed using bcrypt)
   - organizationId (foreign key to Organization)
   - createdAt, updatedAt
2. Add NextAuth required tables:
   - Account (required by NextAuth schema, but not used for OAuth)
   - Session (if using database sessions)
   - VerificationToken (for email verification - optional)
3. Update Organization model:
   - Add users relation (one-to-many: one org has many users)
   - No roles/permissions in Phase 4 (simplified)
4. Run migration: `npx prisma migrate dev --name add_auth_tables`
5. Update TypeScript types

**Files to Modify:**
- `prisma/schema.prisma` - Add User, Account, Session, VerificationToken models
- `lib/types.ts` - Add User interface

**Database Changes:**
- New tables: User, Account, Session (optional), VerificationToken
- Organization relationship: Organization.users[]

**Testing:**
- Test Prisma schema validates correctly
- Test migration runs successfully
- Test User model can be created with nullable organizationId
- Test Organization.users relation works correctly
- Test TypeScript types match Prisma schema

**Dependencies:** Sub-Phase 4A

**Estimated Time:** 1-2 hours

---

### Sub-Phase 4C: Authentication UI
**Goal:** Build login and signup pages

**Tasks:**
1. Create login page (`app/login/page.tsx`):
   - Email/password form
   - Error handling
   - Redirect authenticated users with org to dashboard
   - Redirect authenticated users without org to onboarding
   - Redirect after successful login based on org status
2. Create signup page (`app/signup/page.tsx`):
   - Registration form (email, password, name only - no organization selection)
   - Validation
   - Redirect authenticated users with org to dashboard
   - Redirect authenticated users without org to onboarding
   - Redirect after successful signup to `/onboarding`
3. Create auth components:
   - LoginForm component
   - SignupForm component
   - Form validation
4. Add "Sign Out" functionality to profile dropdown
5. Update DashboardLayout to show login button when not authenticated
6. Add protected route redirects

**Files to Create:**
- `app/login/page.tsx` - Login page
- `app/signup/page.tsx` - Signup page
- `components/auth/LoginForm.tsx` - Login form component
- `components/auth/SignupForm.tsx` - Signup form component

**Files to Modify:**
- `components/layout/DashboardLayout.tsx` - Add login/logout UI
- `app/page.tsx` - Redirect logic based on auth state

**Testing:**
- Test login form validation (email required, password required)
- Test signup form validation (email, password, name required)
- Test login page redirects authenticated users correctly (with/without org)
- Test signup page redirects authenticated users correctly (with/without org)
- Test signup creates user account successfully
- Test login authenticates user successfully
- Test form error messages display correctly
- Test sign out functionality works

**Files to Create (Tests):**
- `tests/app/login/page.test.tsx` - Login page tests
- `tests/app/signup/page.test.tsx` - Signup page tests
- `tests/components/auth/LoginForm.test.tsx` - Login form component tests
- `tests/components/auth/SignupForm.test.tsx` - Signup form component tests

**Dependencies:** Sub-Phase 4B

**Estimated Time:** 2-3 hours

---

### Sub-Phase 4C.5: Onboarding Flow
**Goal:** Create onboarding page where users join existing organization or create new organization

**Tasks:**
1. Create onboarding page (`app/onboarding/page.tsx`):
   - Check if user already has organization (redirect to dashboard if yes)
   - Two options: "Join Existing Organization" or "Create New Organization"
   - Toggle between join/create flows
   - Redirect to dashboard after completion
2. Create join organization flow:
   - `components/onboarding/JoinOrgForm.tsx` component
   - Search/select from existing organizations list
   - Display organization details before joining
   - API call to join organization (updates user's organizationId)
3. Create organization creation flow:
   - `components/onboarding/CreateOrgForm.tsx` component
   - Organization creation form with required/optional fields
   - Required fields: name, type (one or more), description, contactInternal
   - Optional fields: website, email
   - Not required initially: currentNeedsInternal, resourcesOffered, location (can be added later via settings)
   - API call to create organization (creates org and links user)
   - Validation and error handling
4. Create main onboarding component:
   - `components/onboarding/OnboardingFlow.tsx` - Main component with join/create toggle
   - Handle loading states and errors
   - Success feedback after completion

**Files to Create:**
- `app/onboarding/page.tsx` - Onboarding page
- `components/onboarding/OnboardingFlow.tsx` - Main onboarding component
- `components/onboarding/JoinOrgForm.tsx` - Join existing org form
- `components/onboarding/CreateOrgForm.tsx` - Create new org form

**Files to Modify:**
- `lib/api/organizations.ts` - Add `createOrganization()` function
- `lib/api-client/organizations.ts` - Add organization creation API client
- `app/api/organizations/route.ts` - Add POST handler for creating organizations
- `app/api/organizations/[id]/route.ts` - Add POST handler for joining organizations (or create separate endpoint)

**Testing:**
- Test onboarding page redirects users with orgs to dashboard
- Test onboarding page displays for users without orgs
- Test join organization form displays organizations list
- Test join organization form validates selection
- Test join organization API call updates user's organizationId
- Test create organization form validates required fields (name, type, description, contactInternal)
- Test create organization form accepts optional fields (website, email)
- Test create organization API creates org and links user
- Test organization creation prevents duplicate names (if applicable)
- Test onboarding completion redirects to dashboard
- Test error handling for failed API calls

**Files to Create (Tests):**
- `tests/app/onboarding/page.test.tsx` - Onboarding page tests
- `tests/components/onboarding/OnboardingFlow.test.tsx` - Onboarding flow tests
- `tests/components/onboarding/JoinOrgForm.test.tsx` - Join org form tests
- `tests/components/onboarding/CreateOrgForm.test.tsx` - Create org form tests
- `tests/app/api/organizations-create.test.ts` - Organization creation API tests
- `tests/app/api/organizations-join.test.ts` - Organization joining API tests

**Dependencies:** Sub-Phase 4C

**Estimated Time:** 3-4 hours

---

### Sub-Phase 4D: Session Management & Middleware
**Goal:** Implement session handling and route protection

**Tasks:**
1. Create auth utilities:
   - `lib/auth.ts` - Session helpers, getServerSession
   - `lib/auth-client.ts` - Client-side session hooks
   - `lib/auth-utils.ts` - Helper to check if user has organization
2. Create Next.js middleware for route protection:
   - `middleware.ts` - Protect routes that require auth
   - Redirect unauthenticated users to login
   - Check if authenticated user has organizationId
   - Redirect authenticated users without org to `/onboarding` (except for login/signup/onboarding pages)
   - Allow access to `/onboarding` for authenticated users without orgs
   - Redirect authenticated users with orgs away from `/onboarding` to dashboard
3. Add session provider to root layout
4. Create hooks:
   - `useSession()` hook wrapper
   - `useRequireAuth()` hook for protected pages
   - `useRequireOrg()` hook to check if user has organization
5. Update API routes to check authentication
6. Update login redirect logic:
   - After login, check if user has organizationId
   - Redirect to `/onboarding` if no org, `/dashboard` if has org

**Files to Create:**
- `middleware.ts` - Route protection middleware
- `lib/auth-client.ts` - Client-side auth utilities
- `lib/auth-utils.ts` - User-organization helpers (check if user has org)
- `lib/hooks/useAuth.ts` - Custom auth hooks

**Files to Modify:**
- `app/layout.tsx` - Add SessionProvider
- `lib/auth.ts` - Add session utilities
- API routes - Add auth checks

**Testing:**
- Test getServerSession returns correct session data
- Test client-side session hooks return correct data
- Test hasUserOrganization helper correctly identifies users with/without orgs
- Test middleware redirects unauthenticated users to login
- Test middleware redirects authenticated users without orgs to onboarding
- Test middleware allows authenticated users with orgs to access protected routes
- Test middleware redirects authenticated users with orgs away from onboarding
- Test middleware allows public access to `/organizations` list
- Test useSession hook works in client components
- Test useRequireAuth hook redirects unauthenticated users
- Test useRequireOrg hook redirects users without orgs
- Test session persists across page reloads

**Files to Create (Tests):**
- `tests/lib/auth.test.ts` - Auth utilities tests
- `tests/lib/auth-client.test.ts` - Client-side auth tests
- `tests/lib/auth-utils.test.ts` - User-org helper tests
- `tests/lib/hooks/useAuth.test.ts` - Auth hooks tests
- `tests/middleware.test.ts` - Middleware tests

**Dependencies:** Sub-Phase 4C

**Estimated Time:** 2-3 hours

---

### Sub-Phase 4E: User-Organization Linking
**Goal:** Link users to organizations and update data models

**Tasks:**
1. Update Organization model:
   - Add users relation (one-to-many: one org has many users)
   - Each user belongs to exactly one organization
   - No organization owner/member roles (simplified for Phase 4)
   - Note: Users can have `organizationId = null` initially (during onboarding)
2. Add organization creation API:
   - `createOrganization()` function in `lib/api/organizations.ts`
   - Creates organization and automatically links authenticated user to it
   - Validates required fields: name, type, description, contactInternal
   - Optional fields: website, email
   - Returns created organization
3. Add organization joining API:
   - `joinOrganization()` function or endpoint to update user's organizationId
   - Verify user doesn't already have an organization (locked after onboarding)
   - Update user's organizationId to join selected org
4. Update API functions:
   - `getOrganizations()` - Filter by user's org (optional, can show all for onboarding)
   - `createForum()` - Use authenticated user's org
   - `createPost()` - Use authenticated user
5. Update ForumPost/ForumReply:
   - Change authorOrgId to userId (or keep both)
   - Update authorOrgName to use user's org name
6. Create user-organization utilities:
   - `getUserOrganization()` - Get user's org
   - `getUserOrgId()` - Get user's org ID
   - `hasUserOrganization()` - Check if user has an org (for middleware)
7. Update seed script to create test users
8. Clarify: Users cannot change organization after onboarding (locked)

**Files to Modify:**
- `lib/api/organizations.ts` - Add `createOrganization()` and `joinOrganization()` functions
- `lib/api/forums.ts` - Use authenticated user
- `lib/api-client/organizations.ts` - Add organization creation and joining API clients
- `lib/api-client/forums.ts` - Pass auth context
- `app/api/organizations/route.ts` - Add POST handler for creating organizations
- `app/api/organizations/[id]/route.ts` - Add POST handler for joining organizations (or create `app/api/organizations/join/route.ts`)
- `prisma/seed.ts` - Add test users

**Files to Create:**
- `lib/auth-utils.ts` - User-organization helpers

**Database Changes:**
- Update ForumPost.authorOrgId to use userId
- Update ForumReply.authorOrgId to use userId
- Or keep both for backward compatibility

**Testing:**
- Test createOrganization function creates org and links user
- Test createOrganization validates required fields
- Test createOrganization handles optional fields correctly
- Test joinOrganization updates user's organizationId
- Test joinOrganization prevents joining if user already has org
- Test getUserOrganization returns correct organization
- Test getUserOrgId returns correct org ID
- Test hasUserOrganization correctly identifies org status
- Test createForum uses authenticated user's org
- Test createPost uses authenticated user
- Test authorOrgName uses user's org name from relation
- Test seed script creates test users with orgs

**Files to Create (Tests):**
- `tests/lib/api/organizations-create.test.ts` - Organization creation tests
- `tests/lib/api/organizations-join.test.ts` - Organization joining tests
- `tests/lib/auth-utils.test.ts` - User-org utility tests (if not already created)
- `tests/lib/api/forums-auth.test.ts` - Forum creation with auth tests

**Dependencies:** Sub-Phase 4D

**Estimated Time:** 3-4 hours

---

### Sub-Phase 4F: Protected Routes
**Goal:** Protect routes that require authentication

**Tasks:**
1. Update middleware to protect routes:
   - `/dashboard` - Require auth + org (redirect to onboarding if no org)
   - `/forums` - Require auth + org (redirect to onboarding if no org)
   - `/organizations/[id]` - Require auth + org (redirect to onboarding if no org)
   - `/profile` - Require auth + org (redirect to onboarding if no org)
   - `/settings` - Require auth + org (redirect to onboarding if no org)
   - `/onboarding` - Require auth, but allow users without orgs
     - Redirect authenticated users with orgs away from `/onboarding` to dashboard
     - Allow authenticated users without orgs to access `/onboarding`
   - `/login` and `/signup` - Allow unauthenticated, redirect authenticated users with orgs to dashboard, redirect authenticated users without orgs to onboarding
   - Only `/organizations` (list) remains public
2. Protect API routes:
   - `/api/organizations` GET - Public (for org list)
   - `/api/organizations` POST - Require auth (for creating orgs during onboarding)
   - `/api/organizations/[id]` GET - Require auth + org
   - `/api/organizations/join` POST - Require auth (for joining orgs during onboarding)
   - All other API endpoints - Require auth + org
3. Create protected route wrapper:
   - `components/auth/ProtectedRoute.tsx` - Wrapper component
   - Or use middleware redirects
4. Add authorization checks:
   - Can user edit their own posts?
   - Can user delete their own posts?
   - Organization-level permissions (future)
5. Update middleware logic:
   - Check authentication status
   - Check organization status (organizationId exists)
   - Apply appropriate redirects based on auth + org status

**Files to Create:**
- `components/auth/ProtectedRoute.tsx` - Route protection component
- `lib/auth-api.ts` - API route auth utilities

**Files to Modify:**
- `middleware.ts` - Add protected routes
- API route handlers - Add auth checks
- `app/forums/page.tsx` - Check auth before creating forum

**Testing:**
- Test protected routes require authentication
- Test protected routes require organization (redirect to onboarding)
- Test `/onboarding` allows authenticated users without orgs
- Test `/onboarding` redirects authenticated users with orgs to dashboard
- Test `/login` and `/signup` redirect authenticated users correctly
- Test `/organizations` list remains public
- Test API routes require authentication (except public endpoints)
- Test API routes require organization (except onboarding endpoints)
- Test ProtectedRoute component works correctly
- Test authorization checks (users can edit/delete own posts)
- Test middleware handles all route combinations correctly

**Files to Create (Tests):**
- `tests/middleware-routes.test.ts` - Middleware route protection tests
- `tests/components/auth/ProtectedRoute.test.tsx` - Protected route component tests
- `tests/lib/auth-api.test.ts` - API route auth utility tests
- `tests/app/api/protected-routes.test.ts` - Protected API route tests

**Dependencies:** Sub-Phase 4E

**Estimated Time:** 2-3 hours

---

### Sub-Phase 4G: User Profile Management
**Goal:** Build user profile and settings pages

**Tasks:**
1. Create user profile page (`app/profile/page.tsx`):
   - Display user info (name, email, organization)
   - Edit profile form
   - Change password (if using credentials)
2. Update settings page (`app/settings/page.tsx`):
   - Organization settings (if user is org owner)
   - User preferences
   - Account management
3. Create profile components:
   - `components/profile/UserProfile.tsx` - Profile display
   - `components/profile/EditProfileForm.tsx` - Edit form
   - `components/profile/ChangePasswordForm.tsx` - Password change
4. Add API routes:
   - `PUT /api/user/profile` - Update profile
   - `PUT /api/user/password` - Change password
   - `GET /api/user/me` - Get current user

**Files to Create:**
- `app/profile/page.tsx` - User profile page
- `components/profile/UserProfile.tsx`
- `components/profile/EditProfileForm.tsx`
- `components/profile/ChangePasswordForm.tsx`
- `app/api/user/me/route.ts` - Get current user
- `app/api/user/profile/route.ts` - Update profile
- `app/api/user/password/route.ts` - Change password

**Files to Modify:**
- `app/settings/page.tsx` - Add user settings
- `components/layout/DashboardLayout.tsx` - Link to profile

**Testing:**
- Test profile page displays user info correctly
- Test profile page displays user's organization
- Test edit profile form validates input
- Test profile update API updates user info
- Test password change form validates old password
- Test password change API updates password correctly
- Test password change validates password strength (if implemented)
- Test GET /api/user/me returns current user data
- Test PUT /api/user/profile requires authentication
- Test PUT /api/user/password requires authentication
- Test profile page redirects unauthenticated users

**Files to Create (Tests):**
- `tests/app/profile/page.test.tsx` - Profile page tests
- `tests/components/profile/UserProfile.test.tsx` - User profile component tests
- `tests/components/profile/EditProfileForm.test.tsx` - Edit profile form tests
- `tests/components/profile/ChangePasswordForm.test.tsx` - Change password form tests
- `tests/app/api/user-me.test.ts` - Get current user API tests
- `tests/app/api/user-profile.test.ts` - Update profile API tests
- `tests/app/api/user-password.test.ts` - Change password API tests

**Dependencies:** Sub-Phase 4F

**Estimated Time:** 3-4 hours

---

### Sub-Phase 4H: Testing & Validation
**Goal:** Comprehensive testing of authentication and authorization

**Tasks:**
1. Write comprehensive integration tests:
   - Full auth flow (signup → onboarding → login → use app)
   - Complete onboarding flow (both join and create paths)
   - Session persistence across page reloads
   - Protected route access patterns
   - API route authentication flows
   - User-organization linking throughout app
   - Profile management flows
2. Test end-to-end scenarios:
   - User signs up → completes onboarding → accesses dashboard
   - User logs in → redirected based on org status
   - User creates forum/post → uses authenticated org
   - User updates profile → changes persist
   - User changes password → can log in with new password
   - Multiple users join same organization
   - User cannot change organization after onboarding
3. Test edge cases and error scenarios:
   - Invalid login credentials
   - Duplicate email signup
   - Organization creation with invalid data
   - API calls without authentication
   - API calls without organization
   - Session expiration handling
4. Update existing tests:
   - Add auth mocks to existing API route tests
   - Add auth context to existing component tests
   - Update existing tests to account for authentication requirements

**Files to Create:**
- `tests/integration/auth-flow.test.ts` - Full auth flow integration tests
- `tests/integration/onboarding-flow.test.ts` - Onboarding flow integration tests
- `tests/integration/protected-routes.test.ts` - Protected routes integration tests
- `tests/integration/user-org-linking.test.ts` - User-org linking integration tests
- `tests/app/api/auth.test.ts` - Auth API endpoint tests (if not already created)
- `tests/e2e/auth-journey.test.ts` - End-to-end auth journey tests

**Files to Modify:**
- Existing API route tests - Add auth mocks
- Component tests - Add auth context mocks
- Forum/Post tests - Add auth requirements

**Dependencies:** Sub-Phase 4G

**Estimated Time:** 3-4 hours

---

## Key Features to Implement

### Authentication
- ✅ Email/password authentication only
- ✅ Session management
- ✅ Password hashing (bcrypt)
- ⏳ Email verification (optional - not in initial implementation)

### User Management
- ✅ User registration
- ✅ User login/logout
- ✅ User profile
- ✅ Password change
- ✅ Session persistence

### Organization Linking
- ✅ User belongs to one organization (one-to-many: org has many users)
- ✅ Multiple users can belong to the same organization
- ✅ Organization-based data filtering
- ✅ User's posts/replies linked to their org

### Route Protection
- ✅ Middleware-based protection
- ✅ API route authentication
- ✅ Client-side route guards
- ✅ Redirect to login when unauthenticated

---

## Database Schema Changes

**Note:** Users can have `organizationId = null` initially during the onboarding process. After onboarding is complete, the user is linked to an organization and cannot change it. Middleware checks for this state and redirects users without organizations to `/onboarding`.

### New Models

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  emailVerified DateTime?
  password      String?   // Hashed password (if using credentials)
  organizationId String?  // Nullable: can be null during onboarding, required after onboarding
  organization  Organization? @relation(fields: [organizationId], references: [id])
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  
  @@index([email])
  @@index([organizationId])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expires      DateTime
  
  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}
```

### Updated Models

```prisma
model Organization {
  // ... existing fields
  users      User[]   // New relation
}

model ForumPost {
  // ... existing fields
  authorUserId String? // New field (optional for migration)
  authorUser   User?   @relation(fields: [authorUserId], references: [id])
  // Keep authorOrgId for backward compatibility during migration
}
```

---

## Files Structure After Phase 4

```
app/
├── api/
│   ├── auth/
│   │   └── [...nextauth]/route.ts  # NextAuth handler
│   ├── organizations/
│   │   ├── route.ts                 # GET org list (public), POST create org (auth)
│   │   ├── [id]/route.ts            # GET org by id (auth + org), POST join org (auth)
│   │   └── join/route.ts            # POST join organization (auth, alternative to [id]/route.ts)
│   ├── user/
│   │   ├── me/route.ts              # GET current user
│   │   ├── profile/route.ts         # PUT update profile
│   │   └── password/route.ts       # PUT change password
│   └── ...existing routes...
├── login/
│   └── page.tsx                     # Login page
├── signup/
│   └── page.tsx                     # Signup page
├── onboarding/
│   └── page.tsx                     # Onboarding page (join/create org)
├── profile/
│   └── page.tsx                     # User profile page
└── ...existing pages...

components/
├── auth/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── ProtectedRoute.tsx
├── onboarding/
│   ├── OnboardingFlow.tsx          # Main onboarding component
│   ├── JoinOrgForm.tsx             # Join existing org form
│   └── CreateOrgForm.tsx            # Create new org form
└── profile/
    ├── UserProfile.tsx
    ├── EditProfileForm.tsx
    └── ChangePasswordForm.tsx

lib/
├── auth.ts                          # NextAuth config
├── auth-client.ts                   # Client-side auth
├── auth-utils.ts                    # User-org helpers (hasUserOrganization, etc.)
├── auth-api.ts                      # API route auth
└── ...existing files...

prisma/
└── schema.prisma                    # Updated with User model
```

---

## Testing Strategy

### Unit Tests
- NextAuth configuration
- Auth utilities
- Session helpers
- User-organization helpers

### Integration Tests
- Login flow
- Signup flow
- Protected route access
- API route authentication
- User-organization linking

### E2E Tests (Future)
- Complete user journey
- Organization management
- Permission checks

---

## Migration Strategy

### Database Migration
1. Add User, Account, Session, VerificationToken models
2. Add organizationId to User
3. Add users relation to Organization
4. Add authorUserId to ForumPost/ForumReply (optional, keep authorOrgId)
5. Run migration: `npx prisma migrate dev --name add_auth_tables`

### Data Migration
- Existing posts/replies keep authorOrgId
- New posts/replies use userId
- Backfill userId from authorOrgId if needed

---

## Environment Variables

```env
# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"    # Development
# NEXTAUTH_URL="https://your-domain.com" # Production

# Database (already configured in Phase 3)
DATABASE_URL="file:./dev.db"  # Local SQLite
# DATABASE_URL="postgresql://..." # Production PostgreSQL
```

---

## Security Considerations

1. **Password Hashing:** Use bcrypt with salt rounds
2. **Session Security:** Secure cookies, HTTP-only flags
3. **CSRF Protection:** NextAuth handles this automatically
4. **Rate Limiting:** Add rate limiting to login/signup (future)
5. **Email Verification:** Optional but recommended
6. **Password Policy:** Enforce strong passwords (future)

---

## Dependencies

**New npm packages:**
- `next-auth@beta` - NextAuth.js for App Router
- `bcryptjs` - Password hashing (if using credentials)
- `@types/bcryptjs` - TypeScript types

---

## Estimated Timeline

- **4A:** 1-2 hours (NextAuth Setup)
- **4B:** 1-2 hours (Database Schema)
- **4C:** 2-3 hours (Auth UI)
- **4C.5:** 3-4 hours (Onboarding Flow)
- **4D:** 2-3 hours (Session & Middleware)
- **4E:** 3-4 hours (User-Org Linking)
- **4F:** 2-3 hours (Protected Routes)
- **4G:** 3-4 hours (Profile Management)
- **4H:** 3-4 hours (Testing)

**Total:** ~21-29 hours

---

## Success Criteria

- ✅ Users can create accounts
- ✅ Users can log in and log out
- ✅ Sessions persist across page reloads
- ✅ Users complete onboarding (join existing org or create new org)
- ✅ Onboarding is required - users without orgs are redirected to onboarding
- ✅ Organization is locked after onboarding - users cannot change their org
- ✅ Protected routes redirect to login when unauthenticated
- ✅ Protected routes redirect to onboarding when authenticated but no org
- ✅ API routes require authentication
- ✅ Users are linked to organizations
- ✅ Posts/replies are created by authenticated users
- ✅ User profiles can be viewed and edited
- ✅ All tests passing
- ✅ No breaking changes to existing features

---

## Next Steps After Phase 4

- **Phase 5:** AI Suggestions
- **Future:** Notifications, permissions, multi-org support, etc.

