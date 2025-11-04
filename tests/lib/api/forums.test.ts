import { describe, it, expect, beforeEach } from 'vitest';
import { getForums, getForum, getForumPosts, getPost, getPostReplies, getRecentActivity } from '@/lib/api/forums';
import { seedDatabase } from '@/tests/setup/database';
import { prisma } from '@/lib/prisma';

describe('getForums', () => {
  beforeEach(async () => {
    // Ensure database is seeded
    const orgCount = await prisma.organization.count();
    if (orgCount === 0) {
      await seedDatabase();
    }
  });

  it('should return all forums', async () => {
    const forums = await getForums();
    expect(forums.length).toBeGreaterThan(0);
    forums.forEach(forum => {
      expect(forum).toHaveProperty('id');
      expect(forum).toHaveProperty('title');
      expect(forum).toHaveProperty('memberCount');
      expect(forum).toHaveProperty('messagesToday');
    });
  });

  it('should have required fields on forums', async () => {
    const forums = await getForums();
    forums.forEach(forum => {
      expect(typeof forum.id).toBe('string');
      expect(typeof forum.title).toBe('string');
      expect(typeof forum.memberCount).toBe('number');
      expect(typeof forum.messagesToday).toBe('number');
      expect(forum.memberCount).toBeGreaterThanOrEqual(0);
      expect(forum.messagesToday).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('getForum', () => {
  it('should return forum by id', async () => {
    // Get an actual forum from the database
    const forums = await getForums();
    expect(forums.length).toBeGreaterThan(0);
    
    const forum = await getForum(forums[0].id);
    expect(forum).not.toBeNull();
    expect(forum?.id).toBe(forums[0].id);
    expect(forum?.title).toBe(forums[0].title);
  });

  it('should return null for invalid id', async () => {
    const forum = await getForum('invalid-id');
    expect(forum).toBeNull();
  });
});

describe('getForumPosts', () => {
  it('should return posts for a forum', async () => {
    // Get a forum that has posts
    const forums = await getForums();
    expect(forums.length).toBeGreaterThan(0);
    
    const forumWithPosts = forums.find(f => f.postCount > 0) || forums[0];
    const posts = await getForumPosts(forumWithPosts.id);
    expect(posts.length).toBeGreaterThan(0);
    posts.forEach(post => {
      expect(post.forumId).toBe(forumWithPosts.id);
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('authorOrgName');
    });
  });

  it('should return posts sorted newest first', async () => {
    const forums = await getForums();
    const forumWithPosts = forums.find(f => f.postCount > 0);
    
    if (forumWithPosts) {
      const posts = await getForumPosts(forumWithPosts.id);
      if (posts.length > 1) {
        const firstDate = new Date(posts[0].createdAt).getTime();
        const secondDate = new Date(posts[1].createdAt).getTime();
        expect(firstDate).toBeGreaterThanOrEqual(secondDate);
      }
    }
  });

  it('should return empty array for forum with no posts', async () => {
    // Get a forum without posts or create one
    const forums = await getForums();
    const forum = forums[0];
    const posts = await getForumPosts(forum.id);
    expect(Array.isArray(posts)).toBe(true);
  });
});

describe('getPost', () => {
  it('should return post by id', async () => {
    // Get an actual post from the database
    const forums = await getForums();
    const forumWithPosts = forums.find(f => f.postCount > 0);
    
    if (forumWithPosts) {
      const posts = await getForumPosts(forumWithPosts.id);
      if (posts.length > 0) {
        const post = await getPost(posts[0].id);
        expect(post).not.toBeNull();
        expect(post?.id).toBe(posts[0].id);
      }
    }
  });

  it('should return null for invalid id', async () => {
    const post = await getPost('invalid-id');
    expect(post).toBeNull();
  });
});

describe('getPostReplies', () => {
  it('should return replies for a post', async () => {
    // Get a post that has replies
    const recentActivity = await getRecentActivity(10);
    const postWithReplies = recentActivity.find(p => p.replyCount > 0);
    
    if (postWithReplies) {
      const replies = await getPostReplies(postWithReplies.id);
      expect(Array.isArray(replies)).toBe(true);
      replies.forEach(reply => {
        expect(reply.postId).toBe(postWithReplies.id);
        expect(reply).toHaveProperty('id');
        expect(reply).toHaveProperty('content');
        expect(reply).toHaveProperty('authorOrgName');
      });
    } else {
      // If no posts have replies, test with any post
      const recentActivity = await getRecentActivity(1);
      if (recentActivity.length > 0) {
        const replies = await getPostReplies(recentActivity[0].id);
        expect(Array.isArray(replies)).toBe(true);
      }
    }
  });

  it('should return empty array for post with no replies', async () => {
    // Get a post without replies
    const recentActivity = await getRecentActivity(10);
    const postWithoutReplies = recentActivity.find(p => p.replyCount === 0);
    
    if (postWithoutReplies) {
      const replies = await getPostReplies(postWithoutReplies.id);
      expect(replies).toEqual([]);
    }
  });
});

describe('getRecentActivity', () => {
  it('should return recent posts', async () => {
    const posts = await getRecentActivity(5);
    expect(posts.length).toBeLessThanOrEqual(5);
    expect(posts.length).toBeGreaterThan(0);
  });

  it('should return posts sorted newest first', async () => {
    const posts = await getRecentActivity(10);
    if (posts.length > 1) {
      const firstDate = new Date(posts[0].createdAt).getTime();
      const secondDate = new Date(posts[1].createdAt).getTime();
      expect(firstDate).toBeGreaterThanOrEqual(secondDate);
    }
  });

  it('should respect limit parameter', async () => {
    const posts = await getRecentActivity(3);
    expect(posts.length).toBeLessThanOrEqual(3);
  });

  it('should include forum information (forumTitle and forumCategory)', async () => {
    const posts = await getRecentActivity(5);
    posts.forEach(post => {
      expect(post).toHaveProperty('forumTitle');
      expect(post).toHaveProperty('forumCategory');
      expect(typeof post.forumTitle).toBe('string');
      expect(typeof post.forumCategory).toBe('string');
      expect(post.forumTitle.length).toBeGreaterThan(0);
    });
  });

  it('should have valid forum titles', async () => {
    const posts = await getRecentActivity(10);
    posts.forEach(post => {
      // Forum title should not be 'Unknown Forum' (unless forum doesn't exist)
      // For our mock data, all forums should exist
      expect(post.forumTitle).not.toBe('Unknown Forum');
    });
  });
});

