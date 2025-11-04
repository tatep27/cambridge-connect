/**
 * GET /api/organizations
 * 
 * Get all organizations with optional filtering
 * 
 * Query Parameters:
 *   - type: OrgType[] (multiple values allowed, e.g., ?type=nonprofit&type=community_center)
 *   - search: string (searches name, description, location, resourcesOffered, currentNeedsInternal)
 * 
 * Response:
 *   - 200: { data: Organization[] }
 *   - 500: { error: { message: string } }
 * 
 * Examples:
 *   GET /api/organizations
 *   GET /api/organizations?type=nonprofit
 *   GET /api/organizations?search=cambridge
 *   GET /api/organizations?type=nonprofit&search=volunteer
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-client/route-handlers';
import { parseArrayParam } from '@/lib/api-client/types';
import { getOrganizations, OrganizationFilters } from '@/lib/api/organizations';
import { OrgType } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const filters: OrganizationFilters = {};
    
    const typeParam = searchParams.getAll('type');
    if (typeParam.length > 0) {
      filters.type = typeParam as OrgType[];
    }
    
    const searchParam = searchParams.get('search');
    if (searchParam) {
      filters.search = searchParam;
    }
    
    const organizations = await getOrganizations(filters);
    
    return successResponse(organizations);
  } catch (error) {
    return handleApiError(error);
  }
}

