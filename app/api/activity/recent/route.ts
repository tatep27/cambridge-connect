/**
 * GET /api/activity/recent
 * 
 * Get recent forum activity across all forums
 * Returns posts with forum metadata (title, category) for dashboard display
 * 
 * Query Parameters:
 *   - limit: number (default: 10, must be positive)
 * 
 * Response:
 *   - 200: { data: ForumPostWithForum[] }
 *   - 400: { error: { message: string, code: "BAD_REQUEST" } }
 *   - 500: { error: { message: string } }
 * 
 * Examples:
 *   GET /api/activity/recent
 *   GET /api/activity/recent?limit=20
 */

import { NextRequest } from 'next/server';
import { successResponse, badRequestResponse, handleApiError } from '@/lib/api-client/route-handlers';
import { getRecentActivity } from '@/lib/api/forums';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    
    if (isNaN(limit) || limit < 1) {
      return badRequestResponse('Invalid limit parameter. Must be a positive number.');
    }
    
    const activity = await getRecentActivity(limit);
    
    return successResponse(activity);
  } catch (error) {
    return handleApiError(error);
  }
}

