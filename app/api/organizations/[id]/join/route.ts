/**
 * POST /api/organizations/[id]/join
 * 
 * Join an existing organization (update authenticated user's organizationId)
 * 
 * Path Parameters:
 *   - id: string (organization ID)
 * 
 * Response:
 *   - 200: { data: Organization }
 *   - 400: { error: { message: string } }
 *   - 401: { error: { message: string } } (unauthenticated)
 *   - 404: { error: { message: string } } (organization not found)
 *   - 500: { error: { message: string } }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { successResponse, errorResponse, notFoundResponse, handleApiError } from '@/lib/api-client/route-handlers';
import { joinOrganization } from '@/lib/api/organizations';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    const { id } = await params;

    if (!id) {
      return errorResponse("Organization ID is required", 400);
    }

    const organization = await joinOrganization(id, session.user.id);

    return successResponse(organization);
  } catch (error: any) {
    if (error.message.includes("not found")) {
      return notFoundResponse("Organization not found");
    }
    return handleApiError(error);
  }
}

