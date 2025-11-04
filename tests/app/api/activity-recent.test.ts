import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/activity/recent/route';
import { getRecentActivity } from '@/lib/api/forums';
import { NextRequest } from 'next/server';

// Mock the API functions
vi.mock('@/lib/api/forums');

const mockActivity = [
  {
    id: 'post-1',
    forumId: 'forum-1',
    authorOrgId: 'org-1',
    authorOrgName: 'Test Org',
    title: 'Recent Post',
    content: 'Test content',
    createdAt: '2024-01-28',
    replyCount: 2,
    forumTitle: 'Space Sharing',
    forumCategory: 'space_sharing',
  },
  {
    id: 'post-2',
    forumId: 'forum-2',
    authorOrgId: 'org-2',
    authorOrgName: 'Another Org',
    title: 'Another Post',
    content: 'More content',
    createdAt: '2024-01-27',
    replyCount: 0,
    forumTitle: 'Volunteers',
    forumCategory: 'volunteers',
  },
];

describe('API: /api/activity/recent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return recent activity with default limit', async () => {
    vi.mocked(getRecentActivity).mockResolvedValue(mockActivity);
    
    const url = new URL('http://localhost/api/activity/recent');
    const request = new NextRequest(url);
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockActivity);
    expect(getRecentActivity).toHaveBeenCalledWith(10);
  });

  it('should accept custom limit parameter', async () => {
    vi.mocked(getRecentActivity).mockResolvedValue(mockActivity.slice(0, 1));
    
    const url = new URL('http://localhost/api/activity/recent?limit=5');
    const request = new NextRequest(url);
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockActivity.slice(0, 1));
    expect(getRecentActivity).toHaveBeenCalledWith(5);
  });

  it('should return empty array when no activity exists', async () => {
    vi.mocked(getRecentActivity).mockResolvedValue([]);
    
    const url = new URL('http://localhost/api/activity/recent');
    const request = new NextRequest(url);
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual([]);
  });

  it('should return 400 for invalid limit (negative)', async () => {
    const url = new URL('http://localhost/api/activity/recent?limit=-1');
    const request = new NextRequest(url);
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
    expect(data.error.message).toContain('Invalid limit');
  });

  it('should return 400 for invalid limit (zero)', async () => {
    const url = new URL('http://localhost/api/activity/recent?limit=0');
    const request = new NextRequest(url);
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
    expect(data.error.message).toContain('Invalid limit');
  });

  it('should return 400 for invalid limit (NaN)', async () => {
    const url = new URL('http://localhost/api/activity/recent?limit=abc');
    const request = new NextRequest(url);
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
    expect(data.error.message).toContain('Invalid limit');
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(getRecentActivity).mockRejectedValue(new Error('Database error'));
    
    const url = new URL('http://localhost/api/activity/recent');
    const request = new NextRequest(url);
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
    expect(data.error.message).toContain('Database error');
  });
});

