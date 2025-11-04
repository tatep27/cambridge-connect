import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/forums/[id]/posts/route';
import { getForumPosts } from '@/lib/api/forums';
import { NextRequest } from 'next/server';

// Mock the API functions
vi.mock('@/lib/api/forums');

const mockPosts = [
  {
    id: 'post-1',
    forumId: 'forum-1',
    authorOrgId: 'org-1',
    authorOrgName: 'Test Org',
    title: 'Test Post',
    content: 'Test content',
    createdAt: '2024-01-28',
    replyCount: 2,
  },
  {
    id: 'post-2',
    forumId: 'forum-1',
    authorOrgId: 'org-2',
    authorOrgName: 'Another Org',
    title: 'Another Post',
    content: 'More content',
    createdAt: '2024-01-27',
    replyCount: 0,
  },
];

describe('API: /api/forums/[id]/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all posts for a forum', async () => {
    vi.mocked(getForumPosts).mockResolvedValue(mockPosts);
    
    const url = new URL('http://localhost/api/forums/forum-1/posts');
    const request = new NextRequest(url);
    
    const response = await GET(request, { params: Promise.resolve({ id: 'forum-1' }) });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockPosts);
    expect(getForumPosts).toHaveBeenCalledWith('forum-1');
  });

  it('should return empty array when forum has no posts', async () => {
    vi.mocked(getForumPosts).mockResolvedValue([]);
    
    const url = new URL('http://localhost/api/forums/forum-1/posts');
    const request = new NextRequest(url);
    
    const response = await GET(request, { params: Promise.resolve({ id: 'forum-1' }) });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual([]);
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(getForumPosts).mockRejectedValue(new Error('Database error'));
    
    const url = new URL('http://localhost/api/forums/forum-1/posts');
    const request = new NextRequest(url);
    
    const response = await GET(request, { params: Promise.resolve({ id: 'forum-1' }) });
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
    expect(data.error.message).toContain('Database error');
  });
});

