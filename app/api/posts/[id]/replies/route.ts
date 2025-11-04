/**
 * GET /api/posts/[id]/replies
 * 
 * Get all replies for a post (sorted by oldest first)
 * 
 * Path Parameters:
 *   - id: string (post ID)
 * 
 * Response:
 *   - 200: { data: ForumReply[] }
 *   - 500: { error: { message: string } }
 * 
 * Examples:
 *   GET /api/posts/post-1/replies
 */

import { NextRequest } from 'next/server';
import { successResponse, handleApiError } from '@/lib/api-client/route-handlers';
import { getPostReplies } from '@/lib/api/forums';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const replies = await getPostReplies(id);
    
    return successResponse(replies);
  } catch (error) {
    return handleApiError(error);
  }
}

