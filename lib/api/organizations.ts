import { Organization, OrgType } from "../types";
import { mockOrganizations } from "../data/mockOrganizations";

export interface OrganizationFilters {
  type?: OrgType[];
  search?: string;
}

/**
 * Get all organizations with optional filtering
 */
export async function getOrganizations(filters?: OrganizationFilters): Promise<Organization[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let results = [...mockOrganizations];

  // Filter by org type
  if (filters?.type && filters.type.length > 0) {
    results = results.filter(org => 
      org.type.some(t => filters.type!.includes(t))
    );
  }

  // Search by name, description, location, resources offered, or current needs
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(org => 
      org.name.toLowerCase().includes(searchLower) ||
      org.description.toLowerCase().includes(searchLower) ||
      org.location?.toLowerCase().includes(searchLower) ||
      org.resourcesOffered.toLowerCase().includes(searchLower) ||
      org.currentNeedsInternal.toLowerCase().includes(searchLower)
    );
  }

  return results;
}

/**
 * Get a single organization by ID
 */
export async function getOrganization(id: string): Promise<Organization | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockOrganizations.find(org => org.id === id) || null;
}

/**
 * Get unique values for org types (for filter UI)
 */
export function getOrgTypes(): OrgType[] {
  return ["nonprofit", "public_library", "community_center", "grassroots", "arts_venue", "other"];
}


