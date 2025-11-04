import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/forums/[id]/route';
import { getForum } from '@/lib/api/forums';
import { NextRequest } from 'next/server';

// Mock the API functions
vi.mock('@/lib/api/forums');

const mockForum = {
  id: 'forum-1',
  title: 'Test Forum',
  category: 'space_sharing' as const,
  description: 'Test description',
  createdAt: '2024-01-01',
  postCount: 5,
  lastActivity: '2024-01-28',
  memberCount: 10,
  messagesToday: 2,
};

describe('API: /api/forums/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a single forum', async () => {
    vi.mocked(getForum).mockResolvedValue(mockForum);
    
    const url = new URL('http://localhost/api/forums/forum-1');
    const request = new NextRequest(url);
    
    const response = await GET(request, { params: Promise.resolve({ id: 'forum-1' }) });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockForum);
    expect(getForum).toHaveBeenCalledWith('forum-1');
  });

  it('should return 404 for non-existent forum', async () => {
    vi.mocked(getForum).mockResolvedValue(null);
    
    const url = new URL('http://localhost/api/forums/invalid-id');
    const request = new NextRequest(url);
    
    const response = await GET(request, { params: Promise.resolve({ id: 'invalid-id' }) });
    const data = await response.json();
    
    expect(response.status).toBe(404);
    expect(data.error).toBeDefined();
    expect(data.error.message).toContain('not found');
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(getForum).mockRejectedValue(new Error('Database error'));
    
    const url = new URL('http://localhost/api/forums/forum-1');
    const request = new NextRequest(url);
    
    const response = await GET(request, { params: Promise.resolve({ id: 'forum-1' }) });
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
    expect(data.error.message).toContain('Database error');
  });
});

