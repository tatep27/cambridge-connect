/**
 * Organization types for Cambridge-based organizations
 */
export type OrgType = 
  | "nonprofit" 
  | "public_library" 
  | "community_center" 
  | "grassroots" 
  | "arts_venue" 
  | "other";

/**
 * Common needs that organizations might have
 */
export type NeedType = 
  | "space"
  | "volunteers"
  | "partnerships"
  | "funding"
  | "expertise"
  | "equipment"
  | "marketing"
  | "other";

/**
 * Organization data structure
 */
export interface Organization {
  id: string;
  name: string;
  type: OrgType[];
  description: string; // public-facing description
  website?: string;
  email?: string;
  location?: string; // address or area in Cambridge (not required per PRD)
  contactInternal: string; // internal contact info
  currentNeedsInternal: string; // what they need (sentence or two)
  resourcesOffered: string; // what they offer (free-form text)
}

/**
 * Forum topic categories
 */
export type ForumCategory = 
  | "space_sharing"
  | "volunteers"
  | "events"
  | "partnerships"
  | "resources"
  | "general";

/**
 * Forum data structure
 */
export interface Forum {
  id: string;
  title: string;
  category: ForumCategory;
  description: string;
  createdAt: string;
  postCount: number;
  lastActivity: string;
  memberCount: number;
  messagesToday: number;
}

/**
 * Forum post data structure
 */
export interface ForumPost {
  id: string;
  forumId: string;
  authorOrgId: string;
  authorOrgName: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  replyCount: number;
}

/**
 * Forum reply data structure
 */
export interface ForumReply {
  id: string;
  postId: string;
  authorOrgId: string;
  authorOrgName: string;
  content: string;
  createdAt: string;
}

