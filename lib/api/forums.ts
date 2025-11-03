import { Forum, ForumPost, ForumReply, ForumCategory } from "../types";
import { mockForums, mockPosts, mockReplies } from "../data/mockForums";

// In-memory storage for newly created forums (in Phase 2, this will be replaced with DB)
let createdForums: Forum[] = [];

/**
 * Get all forums
 */
export async function getForums(): Promise<Forum[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...mockForums, ...createdForums];
}

/**
 * Get a single forum by ID
 */
export async function getForum(id: string): Promise<Forum | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockForums.find(forum => forum.id === id) || 
         createdForums.find(forum => forum.id === id) || 
         null;
}

/**
 * Get all posts for a forum
 */
export async function getForumPosts(forumId: string): Promise<ForumPost[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockPosts
    .filter(post => post.forumId === forumId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Get a single post by ID
 */
export async function getPost(postId: string): Promise<ForumPost | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockPosts.find(post => post.id === postId) || null;
}

/**
 * Get all replies for a post
 */
export async function getPostReplies(postId: string): Promise<ForumReply[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockReplies
    .filter(reply => reply.postId === postId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Extended post type with forum information for dashboard display
 */
export interface ForumPostWithForum extends ForumPost {
  forumTitle: string;
  forumCategory: string;
}

/**
 * Get recent activity (most recent posts across all forums)
 * Includes forum title and category for dashboard display
 */
export async function getRecentActivity(limit: number = 10): Promise<ForumPostWithForum[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const allForums = [...mockForums, ...createdForums];
  
  return [...mockPosts]
    .map(post => {
      const forum = allForums.find(f => f.id === post.forumId);
      return {
        ...post,
        forumTitle: forum?.title || 'Unknown Forum',
        forumCategory: forum?.category || 'general',
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

/**
 * Create a new forum
 */
export async function createForum(data: {
  title: string;
  category: ForumCategory;
  description: string;
}): Promise<Forum> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const newForum: Forum = {
    id: `forum-${Date.now()}`,
    title: data.title,
    category: data.category,
    description: data.description,
    createdAt: new Date().toISOString().split('T')[0],
    postCount: 0,
    lastActivity: new Date().toISOString().split('T')[0],
    memberCount: 1, // Creator is the first member
    messagesToday: 0,
  };
  
  createdForums.push(newForum);
  return newForum;
}

