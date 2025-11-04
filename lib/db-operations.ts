/**
 * Database operation utilities
 * 
 * Helper functions for complex database operations using transactions
 */

import { prisma } from './prisma';

/**
 * Create a forum with initial post in a transaction
 * This ensures both are created atomically - if one fails, both are rolled back
 */
export async function createForumWithPost(
  forumData: {
    title: string;
    category: string;
    description: string;
  },
  postData: {
    forumId: string;
    authorOrgId: string;
    authorOrgName: string;
    title: string;
    content: string;
  }
) {
  return prisma.$transaction(async (tx) => {
    // Create forum
    const forum = await tx.forum.create({
      data: {
        title: forumData.title,
        category: forumData.category,
        description: forumData.description,
        createdAt: new Date(),
        postCount: 1, // Will have one post after creation
        lastActivity: new Date(),
        memberCount: 1,
        messagesToday: 0,
      },
    });

    // Create initial post
    const post = await tx.forumPost.create({
      data: {
        forumId: forum.id,
        authorOrgId: postData.authorOrgId,
        authorOrgName: postData.authorOrgName,
        title: postData.title,
        content: postData.content,
        createdAt: new Date(),
        replyCount: 0,
      },
    });

    // Update forum last activity
    await tx.forum.update({
      where: { id: forum.id },
      data: { lastActivity: post.createdAt },
    });

    return { forum, post };
  });
}

/**
 * Update forum counts based on actual database state
 * Uses a transaction to ensure consistency
 */
export async function recalculateForumCounts(forumId: string) {
  return prisma.$transaction(async (tx) => {
    // Count posts
    const postCount = await tx.forumPost.count({
      where: { forumId },
    });

    // Get latest post for lastActivity
    const latestPost = await tx.forumPost.findFirst({
      where: { forumId },
      orderBy: { createdAt: 'desc' },
    });

    // Update forum
    await tx.forum.update({
      where: { id: forumId },
      data: {
        postCount,
        lastActivity: latestPost?.createdAt || new Date(),
      },
    });

    return { postCount, lastActivity: latestPost?.createdAt || new Date() };
  });
}

/**
 * Update post reply count based on actual database state
 */
export async function recalculatePostReplyCount(postId: string) {
  const replyCount = await prisma.forumReply.count({
    where: { postId },
  });

  await prisma.forumPost.update({
    where: { id: postId },
    data: { replyCount },
  });

  return replyCount;
}

