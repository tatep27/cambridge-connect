/**
 * Type compatibility test for Prisma schema
 * 
 * This file verifies that Prisma-generated types match our TypeScript interfaces
 */

import { prisma } from '@/lib/prisma';
import { Organization, Forum, ForumPost, ForumReply } from '@/lib/types';
import { serializeOrgTypes, deserializeOrgTypes, formatDateForApi } from '@/lib/db-helpers';

/**
 * Helper function to convert Prisma Organization to TypeScript Organization
 */
export function prismaOrgToTypeScript(org: {
  id: string;
  name: string;
  type: string;
  description: string;
  website: string | null;
  email: string | null;
  location: string | null;
  contactInternal: string;
  currentNeedsInternal: string;
  resourcesOffered: string;
  createdAt: Date;
  updatedAt: Date;
}): Organization {
  return {
    id: org.id,
    name: org.name,
    type: deserializeOrgTypes(org.type),
    description: org.description,
    website: org.website ?? undefined,
    email: org.email ?? undefined,
    location: org.location ?? undefined,
    contactInternal: org.contactInternal,
    currentNeedsInternal: org.currentNeedsInternal,
    resourcesOffered: org.resourcesOffered,
  };
}

/**
 * Helper function to convert TypeScript Organization to Prisma create input
 */
export function typeScriptOrgToPrisma(org: Organization) {
  return {
    id: org.id,
    name: org.name,
    type: serializeOrgTypes(org.type),
    description: org.description,
    website: org.website ?? null,
    email: org.email ?? null,
    location: org.location ?? null,
    contactInternal: org.contactInternal,
    currentNeedsInternal: org.currentNeedsInternal,
    resourcesOffered: org.resourcesOffered,
  };
}

/**
 * Helper function to convert Prisma Forum to TypeScript Forum
 */
export function prismaForumToTypeScript(forum: {
  id: string;
  title: string;
  category: string;
  description: string;
  createdAt: Date;
  postCount: number;
  lastActivity: Date;
  memberCount: number;
  messagesToday: number;
}): Forum {
  return {
    id: forum.id,
    title: forum.title,
    category: forum.category as Forum['category'],
    description: forum.description,
    createdAt: formatDateForApi(forum.createdAt),
    postCount: forum.postCount,
    lastActivity: formatDateForApi(forum.lastActivity),
    memberCount: forum.memberCount,
    messagesToday: forum.messagesToday,
  };
}

/**
 * Helper function to convert Prisma ForumPost to TypeScript ForumPost
 */
export function prismaPostToTypeScript(post: {
  id: string;
  forumId: string;
  authorOrgId: string;
  authorOrgName: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  replyCount: number;
}): ForumPost {
  return {
    id: post.id,
    forumId: post.forumId,
    authorOrgId: post.authorOrgId,
    authorOrgName: post.authorOrgName,
    title: post.title,
    content: post.content,
    createdAt: formatDateForApi(post.createdAt),
    updatedAt: post.updatedAt ? formatDateForApi(post.updatedAt) : undefined,
    replyCount: post.replyCount,
  };
}

/**
 * Helper function to convert Prisma ForumReply to TypeScript ForumReply
 */
export function prismaReplyToTypeScript(reply: {
  id: string;
  postId: string;
  authorOrgId: string;
  authorOrgName: string;
  content: string;
  createdAt: Date;
}): ForumReply {
  return {
    id: reply.id,
    postId: reply.postId,
    authorOrgId: reply.authorOrgId,
    authorOrgName: reply.authorOrgName,
    content: reply.content,
    createdAt: formatDateForApi(reply.createdAt),
  };
}

