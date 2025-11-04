import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/posts/[id]/route';
import { getPost } from '@/lib/api/forums';
import { NextRequest } from 'next/server';

// Mock the API functions
vi.mock('@/lib/api/forums');

const mockPost = {
  id: 'post-1',
  forumId: 'forum-1',
  authorOrgId: 'org-1',
  authorOrgName: 'Test Org',
  title: 'Test Post',
  content: 'Test content',
  createdAt: '2024-01-28',
  replyCount: 2,
};

describe('API: /api/posts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a single post', async () => {
    vi.mocked(getPost).mockResolvedValue(mockPost);
    
    const url = new URL('http://localhost/api/posts/post-1');
    const request = new NextRequest(url);
    
    const response = await GET(request, { params: Promise.resolve({ id: 'post-1' }) });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockPost);
    expect(getPost).toHaveBeenCalledWith('post-1');
  });

  it('should return 404 for non-existent post', async () => {
    vi.mocked(getPost).mockResolvedValue(null);
    
    const url = new URL('http://localhost/api/posts/invalid-id');
    const request = new NextRequest(url);
    
    const response = await GET(request, { params: Promise.resolve({ id: 'invalid-id' }) });
    const data = await response.json();
    
    expect(response.status).toBe(404);
    expect(data.error).toBeDefined();
    expect(data.error.message).toContain('not found');
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(getPost).mockRejectedValue(new Error('Database error'));
    
    const url = new URL('http://localhost/api/posts/post-1');
    const request = new NextRequest(url);
    
    const response = await GET(request, { params: Promise.resolve({ id: 'post-1' }) });
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
    expect(data.error.message).toContain('Database error');
  });
});

