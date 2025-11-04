import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/posts/[id]/replies/route';
import { getPostReplies } from '@/lib/api/forums';
import { NextRequest } from 'next/server';

// Mock the API functions
vi.mock('@/lib/api/forums');

const mockReplies = [
  {
    id: 'reply-1',
    postId: 'post-1',
    authorOrgId: 'org-1',
    authorOrgName: 'Test Org',
    content: 'Test reply',
    createdAt: '2024-01-29',
  },
  {
    id: 'reply-2',
    postId: 'post-1',
    authorOrgId: 'org-2',
    authorOrgName: 'Another Org',
    content: 'Another reply',
    createdAt: '2024-01-30',
  },
];

describe('API: /api/posts/[id]/replies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all replies for a post', async () => {
    vi.mocked(getPostReplies).mockResolvedValue(mockReplies);
    
    const url = new URL('http://localhost/api/posts/post-1/replies');
    const request = new NextRequest(url);
    
    const response = await GET(request, { params: Promise.resolve({ id: 'post-1' }) });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockReplies);
    expect(getPostReplies).toHaveBeenCalledWith('post-1');
  });

  it('should return empty array when post has no replies', async () => {
    vi.mocked(getPostReplies).mockResolvedValue([]);
    
    const url = new URL('http://localhost/api/posts/post-1/replies');
    const request = new NextRequest(url);
    
    const response = await GET(request, { params: Promise.resolve({ id: 'post-1' }) });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual([]);
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(getPostReplies).mockRejectedValue(new Error('Database error'));
    
    const url = new URL('http://localhost/api/posts/post-1/replies');
    const request = new NextRequest(url);
    
    const response = await GET(request, { params: Promise.resolve({ id: 'post-1' }) });
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
    expect(data.error.message).toContain('Database error');
  });
});

