/**
 * Organizations API Client
 * 
 * Functions for interacting with the organizations API endpoints
 */

import { Organization, OrgType } from '@/lib/types';
import { apiGet, apiPost } from './utils';

export interface OrganizationFilters {
  type?: OrgType[];
  search?: string;
}

/**
 * Get all organizations with optional filtering
 */
export async function getOrganizations(filters?: OrganizationFilters): Promise<Organization[]> {
  const params: Record<string, string | string[]> = {};
  
  if (filters?.type && filters.type.length > 0) {
    params.type = filters.type;
  }
  
  if (filters?.search) {
    params.search = filters.search;
  }
  
  return apiGet<Organization[]>('/api/organizations', params);
}

/**
 * Get a single organization by ID
 */
export async function getOrganization(id: string): Promise<Organization> {
  return apiGet<Organization>(`/api/organizations/${id}`);
}

/**
 * Create a new organization
 */
export interface CreateOrganizationInput {
  name: string;
  type: OrgType[];
  description: string;
  website?: string;
  email?: string;
  location?: string;
  contactInternal: string;
  currentNeedsInternal?: string;
  resourcesOffered?: string;
}

export async function createOrganization(input: CreateOrganizationInput): Promise<Organization> {
  return apiPost<Organization>('/api/organizations', input);
}

/**
 * Join an existing organization
 */
export async function joinOrganization(organizationId: string): Promise<Organization> {
  return apiPost<Organization>(`/api/organizations/${organizationId}/join`, {});
}

/**
 * Get unique values for org types (for filter UI)
 * This is a client-side utility, not an API call
 */
export function getOrgTypes(): OrgType[] {
  return ["nonprofit", "public_library", "community_center", "grassroots", "arts_venue", "other"];
}

