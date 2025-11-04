/**
 * GET /api/organizations/[id]
 * 
 * Get a single organization by ID
 * 
 * Path Parameters:
 *   - id: string (organization ID)
 * 
 * Response:
 *   - 200: { data: Organization }
 *   - 404: { error: { message: string, code: "NOT_FOUND" } }
 *   - 500: { error: { message: string } }
 * 
 * Examples:
 *   GET /api/organizations/org-1
 */

import { NextRequest } from 'next/server';
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api-client/route-handlers';
import { getOrganization } from '@/lib/api/organizations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const organization = await getOrganization(id);
    
    if (!organization) {
      return notFoundResponse(`Organization with ID ${id} not found`);
    }
    
    return successResponse(organization);
  } catch (error) {
    return handleApiError(error);
  }
}

