import { describe, it, expect } from 'vitest';
import { mockOrganizations } from '@/lib/data/mockOrganizations';
import { mockForums, mockPosts, mockReplies } from '@/lib/data/mockForums';

describe('Mock Organizations Data', () => {
  it('should have organizations with required fields', () => {
    expect(mockOrganizations.length).toBeGreaterThan(0);
    mockOrganizations.forEach(org => {
      expect(org).toHaveProperty('id');
      expect(org).toHaveProperty('name');
      expect(org).toHaveProperty('type');
      expect(Array.isArray(org.type)).toBe(true);
      expect(org.type.length).toBeGreaterThan(0);
      expect(org).toHaveProperty('resourcesOffered');
      expect(typeof org.resourcesOffered).toBe('string');
      expect(org.resourcesOffered.length).toBeGreaterThan(0);
    });
  });

  it('should have valid organization IDs', () => {
    const ids = mockOrganizations.map(org => org.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length); // All IDs should be unique
  });

  it('should have resourcesOffered as complete sentences', () => {
    mockOrganizations.forEach(org => {
      // Should end with a period
      expect(org.resourcesOffered.endsWith('.')).toBe(true);
      // Should have some content
      expect(org.resourcesOffered.length).toBeGreaterThan(10);
    });
  });
});

describe('Mock Forums Data', () => {
  it('should have forums with required fields', () => {
    expect(mockForums.length).toBeGreaterThan(0);
    mockForums.forEach(forum => {
      expect(forum).toHaveProperty('id');
      expect(forum).toHaveProperty('title');
      expect(forum).toHaveProperty('memberCount');
      expect(forum).toHaveProperty('messagesToday');
      expect(typeof forum.memberCount).toBe('number');
      expect(typeof forum.messagesToday).toBe('number');
      expect(forum.memberCount).toBeGreaterThanOrEqual(0);
      expect(forum.messagesToday).toBeGreaterThanOrEqual(0);
    });
  });

  it('should have valid forum IDs', () => {
    const ids = mockForums.map(forum => forum.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('Mock Posts Data', () => {
  it('should have posts with required fields', () => {
    expect(mockPosts.length).toBeGreaterThan(0);
    mockPosts.forEach(post => {
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('forumId');
      expect(post).toHaveProperty('authorOrgName');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('createdAt');
      expect(post).toHaveProperty('replyCount');
    });
  });

  it('should have valid forum references', () => {
    const forumIds = new Set(mockForums.map(f => f.id));
    mockPosts.forEach(post => {
      expect(forumIds.has(post.forumId)).toBe(true);
    });
  });
});

describe('Mock Replies Data', () => {
  it('should have replies with required fields', () => {
    if (mockReplies.length > 0) {
      mockReplies.forEach(reply => {
        expect(reply).toHaveProperty('id');
        expect(reply).toHaveProperty('postId');
        expect(reply).toHaveProperty('authorOrgName');
        expect(reply).toHaveProperty('content');
        expect(reply).toHaveProperty('createdAt');
      });
    }
  });

  it('should have valid post references', () => {
    const postIds = new Set(mockPosts.map(p => p.id));
    mockReplies.forEach(reply => {
      expect(postIds.has(reply.postId)).toBe(true);
    });
  });
});

