/**
 * Test database utilities
 * 
 * Provides functions to manage test database state, including:
 * - Resetting the database before/after tests
 * - Seeding test data
 * - Cleaning up test data
 */

import { prisma } from '@/lib/prisma';

/**
 * Reset the database by deleting all data
 * This ensures a clean state for each test
 */
export async function resetDatabase() {
  // Delete in order to respect foreign key constraints
  await prisma.forumReply.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.forum.deleteMany();
  await prisma.user.deleteMany(); // Delete users before organizations (if FK constraint exists)
  await prisma.organization.deleteMany();
}

/**
 * Seed the database with test data
 * This uses the same seed script but can be customized for tests
 * Note: This will fail if data already exists - use resetAndSeedDatabase() for a clean state
 */
export async function seedDatabase() {
  // Import seed data
  const { mockOrganizations } = await import('@/lib/data/mockOrganizations');
  const { mockForums, mockPosts, mockReplies } = await import('@/lib/data/mockForums');
  const { typeScriptOrgToPrisma } = await import('@/lib/db-transformers');
  const { parseDateFromApi } = await import('@/lib/db-helpers');

  // Check if data already exists
  const orgCount = await prisma.organization.count();
  if (orgCount > 0) {
    // Data already exists, skip seeding
    return;
  }

  // Seed Organizations - use upsert to avoid conflicts
  for (const org of mockOrganizations) {
    await prisma.organization.upsert({
      where: { id: org.id },
      update: {}, // Don't update if exists
      create: typeScriptOrgToPrisma(org),
    });
  }

  // Seed Forums (manual conversion like seed script) - use upsert
  for (const forum of mockForums) {
    await prisma.forum.upsert({
      where: { id: forum.id },
      update: {}, // Don't update if exists
      create: {
        id: forum.id,
        title: forum.title,
        category: forum.category,
        description: forum.description,
        createdAt: parseDateFromApi(forum.createdAt),
        postCount: forum.postCount,
        lastActivity: parseDateFromApi(forum.lastActivity),
        memberCount: forum.memberCount,
        messagesToday: forum.messagesToday,
      },
    });
  }

  // Seed Posts - use upsert
  for (const post of mockPosts) {
    await prisma.forumPost.upsert({
      where: { id: post.id },
      update: {}, // Don't update if exists
      create: {
        id: post.id,
        forumId: post.forumId,
        authorOrgId: post.authorOrgId,
        authorOrgName: post.authorOrgName,
        title: post.title,
        content: post.content,
        createdAt: parseDateFromApi(post.createdAt),
        updatedAt: post.updatedAt ? parseDateFromApi(post.updatedAt) : null,
        replyCount: post.replyCount,
      },
    });
  }

  // Seed Replies - use upsert
  for (const reply of mockReplies) {
    await prisma.forumReply.upsert({
      where: { id: reply.id },
      update: {}, // Don't update if exists
      create: {
        id: reply.id,
        postId: reply.postId,
        authorOrgId: reply.authorOrgId,
        authorOrgName: reply.authorOrgName,
        content: reply.content,
        createdAt: parseDateFromApi(reply.createdAt),
      },
    });
  }
}

/**
 * Reset and seed the database
 * Useful for setting up a known state before tests
 */
export async function resetAndSeedDatabase() {
  await resetDatabase();
  await seedDatabase();
}

/**
 * Verify database connection
 */
export async function verifyDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
  const [orgCount, forumCount, postCount, replyCount] = await Promise.all([
    prisma.organization.count(),
    prisma.forum.count(),
    prisma.forumPost.count(),
    prisma.forumReply.count(),
  ]);

  return {
    organizations: orgCount,
    forums: forumCount,
    posts: postCount,
    replies: replyCount,
  };
}

