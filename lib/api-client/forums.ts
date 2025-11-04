/**
 * Forums API Client
 * 
 * Functions for interacting with the forums API endpoints
 */

import { Forum, ForumPost, ForumReply, ForumCategory, ForumPostWithForum } from '@/lib/types';
import { apiGet, apiPost } from './utils';

/**
 * Get all forums
 */
export async function getForums(): Promise<Forum[]> {
  return apiGet<Forum[]>('/api/forums');
}

/**
 * Get a single forum by ID
 */
export async function getForum(id: string): Promise<Forum> {
  return apiGet<Forum>(`/api/forums/${id}`);
}

/**
 * Get all posts for a forum
 */
export async function getForumPosts(forumId: string): Promise<ForumPost[]> {
  return apiGet<ForumPost[]>(`/api/forums/${forumId}/posts`);
}

/**
 * Get a single post by ID
 */
export async function getPost(postId: string): Promise<ForumPost> {
  return apiGet<ForumPost>(`/api/posts/${postId}`);
}

/**
 * Get all replies for a post
 */
export async function getPostReplies(postId: string): Promise<ForumReply[]> {
  return apiGet<ForumReply[]>(`/api/posts/${postId}/replies`);
}

/**
 * Get recent activity (most recent posts across all forums)
 */
export async function getRecentActivity(limit: number = 10): Promise<ForumPostWithForum[]> {
  return apiGet<ForumPostWithForum[]>(`/api/activity/recent`, { limit: limit.toString() });
}

/**
 * Create a new forum
 */
export async function createForum(data: {
  title: string;
  category: ForumCategory;
  description: string;
}): Promise<Forum> {
  return apiPost<Forum>('/api/forums', data);
}

