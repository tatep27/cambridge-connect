# Phase 1: Frontend Screens with Mock Data

## Goal
Build the core UI we'll show to Cambridge orgs, powered by simple mock data.

## Setup Required
- [ ] Install shadcn/ui
- [ ] Create data-access layer at `lib/api/`
- [ ] Define mock datasets for Cambridge orgs and forums

## Decision Gates

**STOP AND ASK before proceeding:**

1. **Organization Fields:** "Which fields should orgs have right now? name, type, descriptionForOrgs, contactInternal, currentNeedsInternal, resourcesOffered?"

2. **UI Layout:** For each sub-phase, I will present design mockups and get your approval before implementation

---

## Sub-Phases Breakdown

### Sub-Phase 1A: Setup & Data Layer ⏳
**Goal:** Prepare the foundation for all UI work

**Tasks:**
1. Install shadcn/ui (components as needed)
2. Create `lib/api/` directory structure
3. Define TypeScript interfaces for:
   - Organization
   - Forum
   - ForumPost
4. Create mock data files
5. Build data-access functions that return mocks

**Mockup Required:** None (infrastructure only)

**Tests:**
- Unit tests for data-access functions
- Verify mock data shape matches interfaces

---

### Sub-Phase 1B: Dashboard Page 🎨
**Goal:** Show recent forum activity

**Mockup to present to you:**
- Layout of recent activity feed
- Card design for forum posts
- Empty state
- How much activity to show

**Tasks:**
1. Create dashboard layout design (get your approval)
2. Build ActivityFeed component
3. Build PostCard component
4. Wire up to data-access layer
5. Add empty state

**Dependencies:** Sub-Phase 1A

**Tests:**
- Render test for dashboard
- Activity feed renders posts correctly

---

### Sub-Phase 1C: Organizations Browse Page 🎨
**Goal:** Search + filter by org type + filter by "what they offer"

**Mockup to present to you:**
- Layout: list view? grid view? cards?
- Filter UI: checkboxes? dropdowns? chips?
- Search bar placement
- Organization card design
- How to show "what they offer"

**Tasks:**
1. Create organizations layout design (get your approval)
2. Build filter UI (org type selector)
3. Build filter UI (resources offered)
4. Build search bar
5. Build OrganizationCard component
6. Wire up filtering logic
7. Wire up search logic

**Dependencies:** Sub-Phase 1A

**Tests:**
- Filter tests: org type filtering works
- Filter tests: resources offered filtering works
- Search tests: text matching works
- Combined filter + search works

---

### Sub-Phase 1D: Forums List + Detail View 🎨
**Goal:** Split view - forums list (left) + selected forum with posts (right)

**Mockup to present to you:**
- Split-screen layout ratios
- Forum list item design
- Post thread design
- "Create Post" button placement
- Reply display

**Tasks:**
1. Create split-view layout design (get your approval)
2. Build ForumList component (left panel)
3. Build ForumDetail component (right panel)
4. Build PostThread component
5. Build CreatePost form UI (no submission yet - mock only)
6. Wire up to data-access layer
7. Handle forum selection state

**Dependencies:** Sub-Phase 1A

**Tests:**
- Render test for forums page
- Forum selection updates detail view
- Posts render for selected forum

---

### Sub-Phase 1E: AI Resource Finder Placeholder 🎨
**Goal:** "Coming soon" page that looks intentional

**Mockup to present to you:**
- "Coming soon" design aesthetic
- Any teaser content?

**Tasks:**
1. Create coming soon design (get your approval)
2. Build placeholder UI

**Dependencies:** Sub-Phase 1A

**Tests:**
- Render test for AI page

---

### Sub-Phase 1F: Settings Placeholder 🎨
**Goal:** Placeholder page

**Mockup to present to you:**
- Settings layout skeleton

**Tasks:**
1. Create settings layout (get your approval)
2. Build placeholder UI

**Dependencies:** None

**Tests:**
- Render test for settings page

---

## Phase 1 Success Criteria

✅ All pages render with real-looking mock data  
✅ Organizations page can filter by type and offer  
✅ Forums page shows posts for selected forum  
✅ Data-access layer is separated from pages  
✅ All UI uses shadcn/ui components  
✅ Tests written and passing  

---

## Git Commit Plan

After Sub-Phases 1A-1F complete:
```
feat: phase1-ui-with-mocks
```

---

## Next Phase Preview

**Phase 2:** API routes (mock-backed) - make UI talk to real HTTP endpoints

