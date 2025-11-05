import { describe, it, expect, beforeEach } from 'vitest';
import { getOrganizations, getOrgTypes, getOrganization } from '@/lib/api/organizations';
import { seedDatabase } from '@/tests/setup/database';
import { prisma } from '@/lib/prisma';

describe('getOrganizations', () => {
  beforeEach(async () => {
    // Ensure database is seeded
    const orgCount = await prisma.organization.count();
    if (orgCount === 0) {
      await seedDatabase();
    }
  });

  it('should return all organizations when no filters applied', async () => {
    const orgs = await getOrganizations();
    expect(orgs.length).toBeGreaterThan(0);
    expect(orgs[0]).toHaveProperty('id');
    expect(orgs[0]).toHaveProperty('name');
    expect(orgs[0]).toHaveProperty('type');
    expect(orgs[0]).toHaveProperty('resourcesOffered');
  });

  it('should filter by organization type', async () => {
    const orgs = await getOrganizations({ type: ['nonprofit'] });
    expect(orgs.length).toBeGreaterThan(0);
    orgs.forEach(org => {
      expect(org.type).toContain('nonprofit');
    });
  });

  it('should filter by multiple organization types', async () => {
    const orgs = await getOrganizations({ type: ['nonprofit', 'community_center'] });
    orgs.forEach(org => {
      expect(
        org.type.includes('nonprofit') || org.type.includes('community_center')
      ).toBe(true);
    });
  });

  it('should search by name', async () => {
    const orgs = await getOrganizations({ search: 'Cambridge' });
    expect(orgs.length).toBeGreaterThan(0);
    // At least some results should contain 'cambridge' in name, description, or location
    const hasCambridgeMatch = orgs.some(org => 
      org.name.toLowerCase().includes('cambridge') ||
      org.description.toLowerCase().includes('cambridge') ||
      org.location?.toLowerCase().includes('cambridge')
    );
    expect(hasCambridgeMatch).toBe(true);
  });

  it('should search in resources offered', async () => {
    const orgs = await getOrganizations({ search: 'space' });
    const hasSpaceMention = orgs.some(org => 
      org.resourcesOffered.toLowerCase().includes('space')
    );
    expect(hasSpaceMention).toBe(true);
  });

  it('should combine type and search filters', async () => {
    const orgs = await getOrganizations({ 
      type: ['nonprofit'],
      search: 'Cambridge'
    });
    expect(orgs.length).toBeGreaterThan(0);
    orgs.forEach(org => {
      expect(org.type).toContain('nonprofit');
      // Search matches name, description, location, resourcesOffered, or currentNeedsInternal
      const searchMatches = 
        org.name.toLowerCase().includes('cambridge') ||
        org.description.toLowerCase().includes('cambridge') ||
        org.location?.toLowerCase().includes('cambridge') ||
        org.resourcesOffered.toLowerCase().includes('cambridge') ||
        org.currentNeedsInternal.toLowerCase().includes('cambridge');
      expect(searchMatches).toBe(true);
    });
  });

  it('should return empty array when no matches', async () => {
    const orgs = await getOrganizations({ search: 'NonexistentOrg12345' });
    expect(orgs).toEqual([]);
  });
});

describe('getOrganization', () => {
  it('should return organization by id', async () => {
    const org = await getOrganization('org-1');
    expect(org).not.toBeNull();
    expect(org?.id).toBe('org-1');
  });

  it('should return null for invalid id', async () => {
    const org = await getOrganization('invalid-id');
    expect(org).toBeNull();
  });
});

describe('getOrgTypes', () => {
  it('should return array of org types', () => {
    const types = getOrgTypes();
    expect(Array.isArray(types)).toBe(true);
    expect(types.length).toBeGreaterThan(0);
    expect(types).toContain('nonprofit');
  });
});

describe('search in currentNeedsInternal', () => {
  it('should search in current needs text', async () => {
    const orgs = await getOrganizations({ search: 'volunteers' });
    expect(orgs.length).toBeGreaterThan(0);
    const hasVolunteersMatch = orgs.some(org => 
      org.currentNeedsInternal.toLowerCase().includes('volunteers')
    );
    expect(hasVolunteersMatch).toBe(true);
  });
});

