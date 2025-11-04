import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/forums/route';
import { getForums, createForum } from '@/lib/api/forums';
import { NextRequest } from 'next/server';

// Mock the API functions
vi.mock('@/lib/api/forums');

const mockForums = [
  {
    id: 'forum-1',
    title: 'Test Forum 1',
    category: 'space_sharing' as const,
    description: 'Test description',
    createdAt: '2024-01-01',
    postCount: 5,
    lastActivity: '2024-01-28',
    memberCount: 10,
    messagesToday: 2,
  },
  {
    id: 'forum-2',
    title: 'Test Forum 2',
    category: 'volunteers' as const,
    description: 'Another test',
    createdAt: '2024-01-02',
    postCount: 3,
    lastActivity: '2024-01-27',
    memberCount: 8,
    messagesToday: 1,
  },
];

describe('API: /api/forums', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/forums', () => {
    it('should return all forums', async () => {
      vi.mocked(getForums).mockResolvedValue(mockForums);
      
      const url = new URL('http://localhost/api/forums');
      const request = new NextRequest(url);
      
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockForums);
      expect(getForums).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no forums exist', async () => {
      vi.mocked(getForums).mockResolvedValue([]);
      
      const url = new URL('http://localhost/api/forums');
      const request = new NextRequest(url);
      
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(getForums).mockRejectedValue(new Error('Database error'));
      
      const url = new URL('http://localhost/api/forums');
      const request = new NextRequest(url);
      
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
      expect(data.error.message).toContain('Database error');
    });
  });

  describe('POST /api/forums', () => {
    it('should create a new forum', async () => {
      const newForum = {
        id: 'forum-3',
        title: 'New Forum',
        category: 'events' as const,
        description: 'A new forum',
        createdAt: '2024-01-29',
        postCount: 0,
        lastActivity: '2024-01-29',
        memberCount: 1,
        messagesToday: 0,
      };

      vi.mocked(createForum).mockResolvedValue(newForum);
      
      const url = new URL('http://localhost/api/forums');
      const request = new NextRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Forum',
          category: 'events',
          description: 'A new forum',
        }),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.data).toEqual(newForum);
      expect(createForum).toHaveBeenCalledWith({
        title: 'New Forum',
        category: 'events',
        description: 'A new forum',
      });
    });

    it('should return 400 when title is missing', async () => {
      const url = new URL('http://localhost/api/forums');
      const request = new NextRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          category: 'events',
          description: 'A new forum',
        }),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
      expect(data.error.message).toContain('Missing required fields');
    });

    it('should return 400 when category is missing', async () => {
      const url = new URL('http://localhost/api/forums');
      const request = new NextRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Forum',
          description: 'A new forum',
        }),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
      expect(data.error.message).toContain('Missing required fields');
    });

    it('should return 400 when description is missing', async () => {
      const url = new URL('http://localhost/api/forums');
      const request = new NextRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Forum',
          category: 'events',
        }),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
      expect(data.error.message).toContain('Missing required fields');
    });

    it('should return 400 when body is empty', async () => {
      const url = new URL('http://localhost/api/forums');
      const request = new NextRequest(url, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
      expect(data.error.message).toContain('Missing required fields');
    });

    it('should handle invalid JSON', async () => {
      const url = new URL('http://localhost/api/forums');
      const request = new NextRequest(url, {
        method: 'POST',
        body: 'invalid json',
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should handle createForum errors', async () => {
      vi.mocked(createForum).mockRejectedValue(new Error('Creation failed'));
      
      const url = new URL('http://localhost/api/forums');
      const request = new NextRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Forum',
          category: 'events',
          description: 'A new forum',
        }),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
      expect(data.error.message).toContain('Creation failed');
    });
  });
});

