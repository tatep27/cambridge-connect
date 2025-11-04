/**
 * GET /api/forums
 * POST /api/forums
 * 
 * GET: Get all forums
 *   Response:
 *     - 200: { data: Forum[] }
 *     - 500: { error: { message: string } }
 * 
 * POST: Create a new forum
 *   Request Body:
 *     - title: string (required)
 *     - category: ForumCategory (required)
 *     - description: string (required)
 * 
 *   Response:
 *     - 201: { data: Forum }
 *     - 400: { error: { message: string, code: "BAD_REQUEST" } }
 *     - 500: { error: { message: string } }
 * 
 * Examples:
 *   GET /api/forums
 *   POST /api/forums
 *     Body: { "title": "New Forum", "category": "space_sharing", "description": "..." }
 */

import { NextRequest } from 'next/server';
import { successResponse, createdResponse, badRequestResponse, handleApiError, parseRequestBody } from '@/lib/api-client/route-handlers';
import { getForums, createForum } from '@/lib/api/forums';
import { ForumCategory } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const forums = await getForums();
    return successResponse(forums);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<{
      title: string;
      category: ForumCategory;
      description: string;
    }>(request);
    
    // Validate required fields
    if (!body.title || !body.category || !body.description) {
      return badRequestResponse('Missing required fields: title, category, description');
    }
    
    const forum = await createForum({
      title: body.title,
      category: body.category,
      description: body.description,
    });
    
    return createdResponse(forum);
  } catch (error) {
    return handleApiError(error);
  }
}

