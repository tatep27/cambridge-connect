import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/organizations/route';
import { GET as GET_SINGLE } from '@/app/api/organizations/[id]/route';
import { getOrganizations, getOrganization } from '@/lib/api/organizations';
import { NextRequest } from 'next/server';

// Mock the API functions
vi.mock('@/lib/api/organizations');

const mockOrganizations = [
  { id: 'org-1', name: 'Test Org 1', type: ['nonprofit'], description: 'Test', resourcesOffered: 'Test', currentNeedsInternal: 'Test', contactInternal: 'Test' },
  { id: 'org-2', name: 'Test Org 2', type: ['community_center'], description: 'Test', resourcesOffered: 'Test', currentNeedsInternal: 'Test', contactInternal: 'Test' },
];

describe('API: /api/organizations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all organizations', async () => {
    vi.mocked(getOrganizations).mockResolvedValue(mockOrganizations);
    
    const url = new URL('http://localhost/api/organizations');
    const request = new NextRequest(url);
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockOrganizations);
    expect(getOrganizations).toHaveBeenCalledWith({});
  });

  it('should return empty array when no organizations exist', async () => {
    vi.mocked(getOrganizations).mockResolvedValue([]);
    
    const url = new URL('http://localhost/api/organizations');
    const request = new NextRequest(url);
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual([]);
  });

  it('should filter by type', async () => {
    vi.mocked(getOrganizations).mockResolvedValue([mockOrganizations[0]]);
    
    const url = new URL('http://localhost/api/organizations?type=nonprofit');
    const request = new NextRequest(url);
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual([mockOrganizations[0]]);
    expect(getOrganizations).toHaveBeenCalledWith({ type: ['nonprofit'] });
  });

  it('should filter by multiple types', async () => {
    vi.mocked(getOrganizations).mockResolvedValue(mockOrganizations);
    
    const url = new URL('http://localhost/api/organizations?type=nonprofit&type=community_center');
    const request = new NextRequest(url);
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(getOrganizations).toHaveBeenCalledWith({ type: ['nonprofit', 'community_center'] });
  });

  it('should search organizations', async () => {
    vi.mocked(getOrganizations).mockResolvedValue([mockOrganizations[0]]);
    
    const url = new URL('http://localhost/api/organizations?search=Test');
    const request = new NextRequest(url);
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(getOrganizations).toHaveBeenCalledWith({ search: 'Test' });
  });

  it('should combine type and search filters', async () => {
    vi.mocked(getOrganizations).mockResolvedValue([mockOrganizations[0]]);
    
    const url = new URL('http://localhost/api/organizations?type=nonprofit&search=Test');
    const request = new NextRequest(url);
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(getOrganizations).toHaveBeenCalledWith({ type: ['nonprofit'], search: 'Test' });
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(getOrganizations).mockRejectedValue(new Error('Database error'));
    
    const url = new URL('http://localhost/api/organizations');
    const request = new NextRequest(url);
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
    expect(data.error.message).toContain('Database error');
  });
});

describe('API: /api/organizations/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a single organization', async () => {
    vi.mocked(getOrganization).mockResolvedValue(mockOrganizations[0]);
    
    const url = new URL('http://localhost/api/organizations/org-1');
    const request = new NextRequest(url);
    
    const response = await GET_SINGLE(request, { params: Promise.resolve({ id: 'org-1' }) });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockOrganizations[0]);
    expect(getOrganization).toHaveBeenCalledWith('org-1');
  });

  it('should return 404 for non-existent organization', async () => {
    vi.mocked(getOrganization).mockResolvedValue(null);
    
    const url = new URL('http://localhost/api/organizations/invalid-id');
    const request = new NextRequest(url);
    
    const response = await GET_SINGLE(request, { params: Promise.resolve({ id: 'invalid-id' }) });
    const data = await response.json();
    
    expect(response.status).toBe(404);
    expect(data.error).toBeDefined();
    expect(data.error.message).toContain('not found');
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(getOrganization).mockRejectedValue(new Error('Database error'));
    
    const url = new URL('http://localhost/api/organizations/org-1');
    const request = new NextRequest(url);
    
    const response = await GET_SINGLE(request, { params: Promise.resolve({ id: 'org-1' }) });
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
    expect(data.error.message).toContain('Database error');
  });
});

