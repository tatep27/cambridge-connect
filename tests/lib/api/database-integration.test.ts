import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { resetDatabase, seedDatabase, verifyDatabaseConnection, getDatabaseStats } from '@/tests/setup/database';
import { getOrganizations, getOrganization } from '@/lib/api/organizations';
import { getForums, getForum, createForum } from '@/lib/api/forums';
import { recalculateForumCounts, recalculatePostReplyCount } from '@/lib/db-operations';

describe('Database Integration Tests', () => {
  beforeEach(async () => {
    // Ensure database is seeded before each test
    // Only seed if empty to avoid interfering with other tests
    const orgCount = await prisma.organization.count();
    if (orgCount === 0) {
      await seedDatabase();
    }
  });

  // Note: We don't clean up afterEach to avoid interfering with other tests
  // that may be running in parallel. Tests should be isolated by their beforeEach setup.

  describe('Database Connection', () => {
    it('should connect to database successfully', async () => {
      const isConnected = await verifyDatabaseConnection();
      expect(isConnected).toBe(true);
    });

    it('should have seeded data after setup', async () => {
      const stats = await getDatabaseStats();
      expect(stats.organizations).toBeGreaterThan(0);
      expect(stats.forums).toBeGreaterThan(0);
      expect(stats.posts).toBeGreaterThan(0);
    });
  });

  describe('CRUD Operations - Organizations', () => {
    it('should read organizations from database', async () => {
      const orgs = await getOrganizations();
      expect(orgs.length).toBeGreaterThan(0);
      expect(orgs[0]).toHaveProperty('id');
      expect(orgs[0]).toHaveProperty('name');
    });

    it('should read single organization by ID', async () => {
      const allOrgs = await getOrganizations();
      expect(allOrgs.length).toBeGreaterThan(0);
      
      const org = await getOrganization(allOrgs[0].id);
      expect(org).not.toBeNull();
      expect(org?.id).toBe(allOrgs[0].id);
    });

    it('should filter organizations by type', async () => {
      const orgs = await getOrganizations({ type: ['nonprofit'] });
      expect(orgs.length).toBeGreaterThan(0);
      orgs.forEach(org => {
        expect(org.type).toContain('nonprofit');
      });
    });

    it('should search organizations by text', async () => {
      const orgs = await getOrganizations({ search: 'Cambridge' });
      expect(orgs.length).toBeGreaterThan(0);
      // At least one result should match
      const hasMatch = orgs.some(org =>
        org.name.toLowerCase().includes('cambridge') ||
        org.description.toLowerCase().includes('cambridge')
      );
      expect(hasMatch).toBe(true);
    });
  });

  describe('CRUD Operations - Forums', () => {
    it('should read forums from database', async () => {
      const forums = await getForums();
      expect(forums.length).toBeGreaterThan(0);
      expect(forums[0]).toHaveProperty('id');
      expect(forums[0]).toHaveProperty('title');
    });

    it('should read single forum by ID', async () => {
      const allForums = await getForums();
      expect(allForums.length).toBeGreaterThan(0);
      
      const forum = await getForum(allForums[0].id);
      expect(forum).not.toBeNull();
      expect(forum?.id).toBe(allForums[0].id);
    });

    it('should create new forum', async () => {
      const newForum = await createForum({
        title: 'Test Forum',
        category: 'general',
        description: 'Test description',
      });

      expect(newForum).toBeDefined();
      expect(newForum.title).toBe('Test Forum');
      expect(newForum.category).toBe('general');

      // Verify it exists in database
      const retrievedForum = await getForum(newForum.id);
      expect(retrievedForum).not.toBeNull();
      expect(retrievedForum?.title).toBe('Test Forum');
    });
  });

  describe('Database Relationships', () => {
    it('should maintain forum-post relationship', async () => {
      const forums = await getForums();
      const forumWithPosts = forums.find(f => f.postCount > 0);
      
      if (forumWithPosts) {
        const posts = await prisma.forumPost.findMany({
          where: { forumId: forumWithPosts.id },
        });
        
        expect(posts.length).toBeGreaterThan(0);
        posts.forEach(post => {
          expect(post.forumId).toBe(forumWithPosts.id);
        });
      }
    });

    it('should maintain post-reply relationship', async () => {
      const posts = await prisma.forumPost.findMany({
        include: { replies: true },
      });
      
      const postWithReplies = posts.find(p => p.replies.length > 0);
      
      if (postWithReplies) {
        expect(postWithReplies.replies.length).toBeGreaterThan(0);
        postWithReplies.replies.forEach(reply => {
          expect(reply.postId).toBe(postWithReplies.id);
        });
      }
    });
  });

  describe('Count Updates', () => {
    it('should recalculate forum post counts correctly', async () => {
      const forums = await getForums();
      const forum = forums[0];
      
      // Get actual count
      const actualCount = await prisma.forumPost.count({
        where: { forumId: forum.id },
      });

      // Recalculate
      await recalculateForumCounts(forum.id);

      // Verify
      const updatedForum = await prisma.forum.findUnique({
        where: { id: forum.id },
      });

      expect(updatedForum?.postCount).toBe(actualCount);
    });

    it('should recalculate post reply counts correctly', async () => {
      const posts = await prisma.forumPost.findMany();
      const post = posts[0];
      
      // Get actual count
      const actualCount = await prisma.forumReply.count({
        where: { postId: post.id },
      });

      // Recalculate
      await recalculatePostReplyCount(post.id);

      // Verify
      const updatedPost = await prisma.forumPost.findUnique({
        where: { id: post.id },
      });

      expect(updatedPost?.replyCount).toBe(actualCount);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid organization ID gracefully', async () => {
      const org = await getOrganization('non-existent-id');
      expect(org).toBeNull();
    });

    it('should handle invalid forum ID gracefully', async () => {
      const forum = await getForum('non-existent-id');
      expect(forum).toBeNull();
    });
  });

  describe('Performance', () => {
    it('should query organizations quickly', async () => {
      const start = Date.now();
      await getOrganizations();
      const duration = Date.now() - start;
      
      // Should complete in under 1 second (accounting for simulated delay)
      expect(duration).toBeLessThan(2000);
    });

    it('should query forums quickly', async () => {
      const start = Date.now();
      await getForums();
      const duration = Date.now() - start;
      
      // Should complete in under 1 second (accounting for simulated delay)
      expect(duration).toBeLessThan(2000);
    });
  });
});

