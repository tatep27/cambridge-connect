import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { seedDatabase } from './setup/database';

// Seed database once before all tests
beforeAll(async () => {
  // Check if database needs seeding by checking if organizations exist
  const { prisma } = await import('@/lib/prisma');
  const orgCount = await prisma.organization.count();
  if (orgCount === 0) {
    await seedDatabase();
  }
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

