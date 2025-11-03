# Cambridge Connect - Project Status Summary

## Project Overview
**Cambridge Connect** - A collaboration platform for Cambridge-based organizations (nonprofits, public library, community centers, grassroots, arts/venues).

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui components
- Vitest for testing
- Mock data layer (prepared for Phase 2 database integration)

## Current Phase Status

### ✅ Phase 0: Project Setup - COMPLETE
- Next.js project initialized
- TypeScript configured
- TailwindCSS with shadcn/ui setup
- Navigation structure with DashboardLayout component
- Git repository initialized

### ✅ Phase 1A: Setup & Data Layer - COMPLETE
- shadcn/ui installed and configured
- Data access layer at `lib/api/` (organizations.ts, forums.ts)
- TypeScript interfaces defined (Organization, Forum, ForumPost, ForumReply)
- Mock data: 8 organizations, 6 forums, 13+ posts, replies
- Utility functions (formatArrayDisplay for arrays)

### ✅ Phase 1C: Organizations Browse Page - COMPLETE
- Card grid layout (responsive: 1/2/3 columns)
- Search functionality (searches name, description, location, resourcesOffered)
- Organization Type filter (multi-select checkboxes)
- OrganizationCard component (shows name, type, resourcesOffered as text)
- Empty states
- **Design Decision:** `resourcesOffered` changed from array to string (free-form text)

### ✅ Phase 1D: Forums Split-View Page - COMPLETE
- 15% / 85% split layout
- ForumList component (left): shows title, member count, messages today
- ForumDetail component (right): shows selected forum with posts
- PostThread component: title, author org, truncated content with "Read more", reply count
- Expandable replies (click to show/hide)
- Posts sorted newest first
- **NEW:** Create Forum functionality (dropdown menu → "Create a Forum" → modal form)
- **NEW:** Join Forum functionality (dropdown menu → "Join a Forum" → search dialog)
- Create/Join dropdown menu (replaces simple + button)

### ✅ Phase 1B: Dashboard Page - COMPLETE
- Shows recent forum activity from across all forums
- PostCard component: compact post display with forum info, truncated content, reply count
- ActivityFeed component: displays list of recent posts with loading and empty states
- Enhanced getRecentActivity() API: returns posts with forum title and category
- Dashboard is now the home screen (root redirects to /dashboard)
- **Tests:** 27 tests covering PostCard, ActivityFeed, and Dashboard page

### ✅ Phase 1E: AI Resource Finder - COMPLETE
- Moved to fixed top search bar in DashboardLayout
- Search bar persists across all pages (sticky header)
- Placeholder page updated to reference search bar

### ✅ Phase 1F: Settings - COMPLETE
- Moved to Profile dropdown menu in header
- Profile dropdown includes: Profile, Settings, Sign Out
- Removed from sidebar navigation

---

## Test Suite
Located in `tests/` folder:
- 114 tests passing across 14 test files
- Coverage: utilities, API layer, components, mock data validation, pages
- Framework: Vitest + React Testing Library
- Run: `npm test`, `npm run test:watch`, `npm run test:coverage`

---

## Key Files & Structure

```
cambridge-connect/
├── app/
│   ├── page.tsx                     # ✅ Redirects to /dashboard
│   ├── dashboard/page.tsx           # ✅ Complete - recent activity feed
│   ├── organizations/
│   │   ├── page.tsx                 # ✅ Complete - browse with search/filters
│   │   └── [id]/page.tsx            # ✅ Complete - organization profile view
│   ├── forums/page.tsx              # ✅ Complete - split view with URL params
│   ├── ai-resource-finder/page.tsx  # ✅ Complete - references search bar
│   ├── settings/page.tsx            # ✅ Complete - accessed via profile menu
│   └── layout.tsx                   # ✅
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx      # ✅ Fixed sidebar + sticky header with AI search & profile
│   ├── organizations/
│   │   ├── OrganizationCard.tsx    # ✅ Clickable card linking to profile
│   │   └── OrganizationProfile.tsx   # ✅ Complete organization detail view
│   ├── forums/
│   │   ├── ForumList.tsx            # ✅ With dropdown menu
│   │   ├── ForumDetail.tsx          # ✅
│   │   ├── PostThread.tsx           # ✅
│   │   ├── PostCard.tsx             # ✅ NEW - compact post for dashboard
│   │   ├── ActivityFeed.tsx         # ✅ NEW - activity feed component
│   │   ├── CreateForumDialog.tsx    # ✅
│   │   └── JoinForumDialog.tsx      # ✅
│   └── ui/                          # shadcn/ui components
├── lib/
│   ├── api/
│   │   ├── organizations.ts         # ✅ With filtering/search, getOrganization()
│   │   └── forums.ts                # ✅ With createForum(), getRecentActivity()
│   ├── data/
│   │   ├── mockOrganizations.ts     # ✅ 8 orgs (updated structure)
│   │   └── mockForums.ts            # ✅ 6 forums, 13 posts
│   ├── types.ts                     # ✅ All TypeScript interfaces (updated Organization)
│   └── utils.ts                     # ✅ cn(), formatArrayDisplay()
├── tests/                           # ✅ 114 tests passing
│   ├── app/
│   │   ├── dashboard/
│   │   └── organizations/[id]/
│   ├── components/
│   │   ├── forums/                  # PostCard, ActivityFeed tests
│   │   └── organizations/            # OrganizationCard, OrganizationProfile tests
│   └── lib/
└── implementation_notes/            # Phase documentation
```

---

## Recent Changes (Current Session)

1. **Phase 1B: Dashboard Page Implementation:**
   - Created PostCard component for compact post display
   - Created ActivityFeed component with loading/empty states
   - Enhanced getRecentActivity() API to include forum info (ForumPostWithForum)
   - Dashboard shows recent forum activity from all forums
   - Root page now redirects to dashboard

2. **Layout Improvements:**
   - Fixed top bar with AI search/prompt bar (persists across pages)
   - Profile dropdown menu (right side) with Profile, Settings, Sign Out
   - Fixed sidebar navigation
   - Removed "AI Resource Finder" and "Settings" from sidebar (moved to top bar)

3. **Organization Profile View:**
   - Created `/organizations/[id]` dynamic route
   - Created OrganizationProfile component (single card layout)
   - OrganizationCard now clickable, links to profile
   - All organization info displayed in unified card layout
   - "Reach Out to Us For" header for resources section

4. **Data Structure Updates:**
   - Removed `descriptionForOrgs` from Organization interface
   - Changed `currentNeedsInternal` from `NeedType[]` to `string` (descriptive text)
   - Updated all 8 mock organizations with new structure
   - Removed needs-based filtering from API

5. **Test Coverage:**
   - Added 27 new tests (PostCard, ActivityFeed, Dashboard page, OrganizationProfile, Organization page)
   - Updated existing tests for new data structure
   - All 114 tests passing

6. **Build & Development Improvements:**
   - Added cache-clearing scripts (`clean`, `dev:clean`, `build:clean`)
   - Updated Next.js webpack config for better vendor chunk handling
   - Improved .gitignore for cache directories
   - Fixes recurring vendor-chunks build cache errors

---

## Design Decisions Made

1. **Organization resourcesOffered:** Changed from `ResourceType[]` to `string` (free-form text)
2. **Organization currentNeedsInternal:** Changed from `NeedType[]` to `string` (descriptive sentence)
3. **Organization descriptionForOrgs:** Removed - consolidated into single description
4. **Forum sidebar info:** Shows member count + messages today (removed last activity date)
5. **Forum creation:** Dropdown menu with "Join" and "Create" options
6. **UI library:** shadcn/ui (New York style, neutral theme)
7. **Layout:** Fixed sidebar + sticky top bar with AI search and profile menu
8. **Dashboard:** Root page redirects to /dashboard
9. **Organization profile:** All info in single unified card with section dividers
10. **Resources header:** "Reach Out to Us For" (instead of "Resources Offered")

---

## What's Next

1. **Phase 1 Wrap-up:** Final polish, documentation
2. **Phase 2:** API routes (mock-backed, ready for DB later)
3. **AI Resource Finder:** Implement actual search/chat functionality in top bar
4. **Settings Page:** Build out settings functionality
5. **Profile Page:** User/organization profile management

---

## How to Continue

When starting a new chat:
1. Reference this file for context
2. Say: "Continuing Cambridge Connect - Phase 1B: Dashboard page"
3. Reference specific files if needed: "See `app/forums/page.tsx` for forum implementation pattern"

---

**Last Updated:** Current session
**Git Status:** Ready to commit Phase 1B + layout improvements + organization profiles

## Build & Development Scripts

- `npm run clean` - Clear build cache (.next and node_modules/.cache)
- `npm run dev:clean` - Clear cache then start dev server
- `npm run build:clean` - Clear cache then build for production

Use these when encountering vendor-chunks build errors.

