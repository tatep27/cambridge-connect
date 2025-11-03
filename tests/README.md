# Test Suite for Cambridge Connect

This directory contains comprehensive tests for the Cambridge Connect application.

## Test Structure

```
tests/
├── setup.ts                          # Test configuration and global setup
├── lib/
│   ├── utils.test.ts                 # Utility function tests
│   ├── api/
│   │   ├── organizations.test.ts     # Organization API tests
│   │   └── forums.test.ts            # Forum API tests
│   └── data/
│       └── mockData.test.ts          # Mock data validation tests
└── components/
    ├── organizations/
    │   └── OrganizationCard.test.tsx # Organization card component tests
    └── forums/
        ├── ForumList.test.tsx        # Forum list component tests
        ├── PostThread.test.tsx       # Post thread component tests
        └── ForumDetail.test.tsx      # Forum detail component tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

- **Utility Functions**: Tests for `formatArrayDisplay` and other utilities
- **API Layer**: Tests for all data access functions (organizations, forums, posts, replies)
- **Components**: Tests for React components including rendering, interactions, and edge cases
- **Mock Data**: Validation tests to ensure mock data follows expected structure

## Writing New Tests

When adding new features:

1. **Unit Tests**: Add tests for utility functions and data access layer
2. **Component Tests**: Test React components with React Testing Library
3. **Integration Tests**: Test component interactions and data flow

Follow existing test patterns for consistency.

