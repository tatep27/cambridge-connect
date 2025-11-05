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
 * 
 * POST /api/organizations
 * 
 * Create a new organization and link it to the authenticated user
 * 
 * Request Body:
 *   - name: string (required)
 *   - type: OrgType[] (required, at least one)
 *   - description: string (required)
 *   - website?: string (optional)
 *   - email?: string (optional)
 *   - location?: string (optional)
 *   - contactInternal: string (required)
 *   - currentNeedsInternal?: string (optional)
 *   - resourcesOffered?: string (optional)
 * 
 * Response:
 *   - 201: { data: Organization }
 *   - 400: { error: { message: string } }
 *   - 401: { error: { message: string } } (unauthenticated)
 *   - 500: { error: { message: string } }
 */

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { successResponse, errorResponse, badRequestResponse, createdResponse, handleApiError } from '@/lib/api-client/route-handlers';
import { parseArrayParam } from '@/lib/api-client/types';
import { getOrganizations, createOrganization, OrganizationFilters, CreateOrganizationInput } from '@/lib/api/organizations';
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

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    const body = await request.json();
    const {
      name,
      type,
      description,
      website,
      email,
      location,
      contactInternal,
      currentNeedsInternal,
      resourcesOffered,
    } = body;

    // Validate required fields
    if (!name || !type || !description || !contactInternal) {
      return badRequestResponse("Name, type, description, and contact information are required");
    }

    if (!Array.isArray(type) || type.length === 0) {
      return badRequestResponse("At least one organization type is required");
    }

    const input: CreateOrganizationInput = {
      name,
      type: type as OrgType[],
      description,
      website,
      email,
      location,
      contactInternal,
      currentNeedsInternal,
      resourcesOffered,
    };

    const organization = await createOrganization(input, session.user.id);

    return createdResponse(organization);
  } catch (error: any) {
    // Handle validation errors
    if (error.message.includes("required") || error.message.includes("already exists")) {
      return badRequestResponse(error.message);
    }
    return handleApiError(error);
  }
}

