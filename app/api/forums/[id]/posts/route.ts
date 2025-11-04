/**
 * GET /api/forums/[id]/posts
 * 
 * Get all posts for a forum (sorted by newest first)
 * 
 * Path Parameters:
 *   - id: string (forum ID)
 * 
 * Response:
 *   - 200: { data: ForumPost[] }
 *   - 500: { error: { message: string } }
 * 
 * Examples:
 *   GET /api/forums/forum-1/posts
 */

import { NextRequest } from 'next/server';
import { successResponse, handleApiError } from '@/lib/api-client/route-handlers';
import { getForumPosts } from '@/lib/api/forums';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const posts = await getForumPosts(id);
    
    return successResponse(posts);
  } catch (error) {
    return handleApiError(error);
  }
}

