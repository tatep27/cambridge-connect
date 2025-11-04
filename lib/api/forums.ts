import { Forum, ForumPost, ForumReply, ForumCategory, ForumPostWithForum } from "../types";
import { prisma } from "../prisma";
import { prismaForumToTypeScript, prismaPostToTypeScript, prismaReplyToTypeScript } from "../db-transformers";

/**
 * Update forum post count based on actual posts in database
 */
async function updateForumPostCount(forumId: string): Promise<void> {
  const postCount = await prisma.forumPost.count({
    where: { forumId },
  });

  await prisma.forum.update({
    where: { id: forumId },
    data: { postCount },
  });
}

/**
 * Update forum last activity timestamp
 */
async function updateForumLastActivity(forumId: string): Promise<void> {
  const latestPost = await prisma.forumPost.findFirst({
    where: { forumId },
    orderBy: { createdAt: 'desc' },
  });

  if (latestPost) {
    await prisma.forum.update({
      where: { id: forumId },
      data: { lastActivity: latestPost.createdAt },
    });
  }
}

/**
 * Update post reply count based on actual replies in database
 */
async function updatePostReplyCount(postId: string): Promise<void> {
  const replyCount = await prisma.forumReply.count({
    where: { postId },
  });

  await prisma.forumPost.update({
    where: { id: postId },
    data: { replyCount },
  });
}

/**
 * Get all forums
 */
export async function getForums(): Promise<Forum[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    const forums = await prisma.forum.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return forums.map(prismaForumToTypeScript);
  } catch (error: any) {
    throw new Error(`Failed to fetch forums: ${error.message}`);
  }
}

/**
 * Get a single forum by ID
 */
export async function getForum(id: string): Promise<Forum | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  try {
    const forum = await prisma.forum.findUnique({
      where: { id },
    });

    if (!forum) {
      return null;
    }

    return prismaForumToTypeScript(forum);
  } catch (error: any) {
    throw new Error(`Failed to fetch forum: ${error.message}`);
  }
}

/**
 * Get all posts for a forum
 */
export async function getForumPosts(forumId: string): Promise<ForumPost[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    const posts = await prisma.forumPost.findMany({
      where: { forumId },
      orderBy: { createdAt: 'desc' },
    });

    return posts.map(prismaPostToTypeScript);
  } catch (error: any) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
}

/**
 * Get a single post by ID
 */
export async function getPost(postId: string): Promise<ForumPost | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  try {
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return null;
    }

    return prismaPostToTypeScript(post);
  } catch (error: any) {
    throw new Error(`Failed to fetch post: ${error.message}`);
  }
}

/**
 * Get all replies for a post
 */
export async function getPostReplies(postId: string): Promise<ForumReply[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    const replies = await prisma.forumReply.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
    });

    return replies.map(prismaReplyToTypeScript);
  } catch (error: any) {
    throw new Error(`Failed to fetch replies: ${error.message}`);
  }
}

/**
 * Get recent activity (most recent posts across all forums)
 * Includes forum title and category for dashboard display
 */
export async function getRecentActivity(limit: number = 10): Promise<ForumPostWithForum[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    const posts = await prisma.forumPost.findMany({
      include: {
        forum: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return posts.map(post => ({
      ...prismaPostToTypeScript(post),
      forumTitle: post.forum.title,
      forumCategory: post.forum.category,
    }));
  } catch (error: any) {
    throw new Error(`Failed to fetch recent activity: ${error.message}`);
  }
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
  
  try {
    const now = new Date();
    
    const newForum = await prisma.forum.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        createdAt: now,
        postCount: 0,
        lastActivity: now,
        memberCount: 1, // Creator is the first member
        messagesToday: 0,
      },
    });

    return prismaForumToTypeScript(newForum);
  } catch (error: any) {
    // Handle Prisma errors
    if (error.code === 'P2002') {
      throw new Error('A forum with this information already exists');
    }
    throw new Error(`Failed to create forum: ${error.message}`);
  }
}

