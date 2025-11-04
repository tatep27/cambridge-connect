/**
 * GET /api/posts/[id]
 * 
 * Get a single post by ID
 * 
 * Path Parameters:
 *   - id: string (post ID)
 * 
 * Response:
 *   - 200: { data: ForumPost }
 *   - 404: { error: { message: string, code: "NOT_FOUND" } }
 *   - 500: { error: { message: string } }
 * 
 * Examples:
 *   GET /api/posts/post-1
 */

import { NextRequest } from 'next/server';
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api-client/route-handlers';
import { getPost } from '@/lib/api/forums';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const post = await getPost(id);
    
    if (!post) {
      return notFoundResponse(`Post with ID ${id} not found`);
    }
    
    return successResponse(post);
  } catch (error) {
    return handleApiError(error);
  }
}

