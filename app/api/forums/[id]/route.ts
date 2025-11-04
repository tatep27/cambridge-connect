/**
 * GET /api/forums/[id]
 * 
 * Get a single forum by ID
 * 
 * Path Parameters:
 *   - id: string (forum ID)
 * 
 * Response:
 *   - 200: { data: Forum }
 *   - 404: { error: { message: string, code: "NOT_FOUND" } }
 *   - 500: { error: { message: string } }
 * 
 * Examples:
 *   GET /api/forums/forum-1
 */

import { NextRequest } from 'next/server';
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api-client/route-handlers';
import { getForum } from '@/lib/api/forums';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const forum = await getForum(id);
    
    if (!forum) {
      return notFoundResponse(`Forum with ID ${id} not found`);
    }
    
    return successResponse(forum);
  } catch (error) {
    return handleApiError(error);
  }
}

