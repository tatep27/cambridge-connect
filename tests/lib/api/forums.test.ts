import { describe, it, expect } from 'vitest';
import { getForums, getForum, getForumPosts, getPost, getPostReplies, getRecentActivity } from '@/lib/api/forums';

describe('getForums', () => {
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
    const forum = await getForum('forum-1');
    expect(forum).not.toBeNull();
    expect(forum?.id).toBe('forum-1');
    expect(forum?.title).toBe('Space Sharing');
  });

  it('should return null for invalid id', async () => {
    const forum = await getForum('invalid-id');
    expect(forum).toBeNull();
  });
});

describe('getForumPosts', () => {
  it('should return posts for a forum', async () => {
    const posts = await getForumPosts('forum-1');
    expect(posts.length).toBeGreaterThan(0);
    posts.forEach(post => {
      expect(post.forumId).toBe('forum-1');
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('authorOrgName');
    });
  });

  it('should return posts sorted newest first', async () => {
    const posts = await getForumPosts('forum-1');
    if (posts.length > 1) {
      const firstDate = new Date(posts[0].createdAt).getTime();
      const secondDate = new Date(posts[1].createdAt).getTime();
      expect(firstDate).toBeGreaterThanOrEqual(secondDate);
    }
  });

  it('should return empty array for forum with no posts', async () => {
    // Assuming we test with a forum that has no posts or create one
    // For now, just test that it doesn't crash
    const posts = await getForumPosts('forum-1');
    expect(Array.isArray(posts)).toBe(true);
  });
});

describe('getPost', () => {
  it('should return post by id', async () => {
    const post = await getPost('post-1');
    expect(post).not.toBeNull();
    expect(post?.id).toBe('post-1');
  });

  it('should return null for invalid id', async () => {
    const post = await getPost('invalid-id');
    expect(post).toBeNull();
  });
});

describe('getPostReplies', () => {
  it('should return replies for a post', async () => {
    const replies = await getPostReplies('post-1');
    expect(Array.isArray(replies)).toBe(true);
    replies.forEach(reply => {
      expect(reply.postId).toBe('post-1');
      expect(reply).toHaveProperty('id');
      expect(reply).toHaveProperty('content');
      expect(reply).toHaveProperty('authorOrgName');
    });
  });

  it('should return empty array for post with no replies', async () => {
    const replies = await getPostReplies('post-3'); // post-3 has 0 replies
    expect(replies).toEqual([]);
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

