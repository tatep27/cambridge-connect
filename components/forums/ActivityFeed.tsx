"use client";

import { ForumPostWithForum } from "@/lib/types";
import { PostCard } from "./PostCard";

interface ActivityFeedProps {
  posts: ForumPostWithForum[];
  loading?: boolean;
}

export function ActivityFeed({ posts, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-muted-foreground text-lg mb-2">No recent activity</p>
        <p className="text-sm text-muted-foreground">
          Check back later or start a conversation in the forums!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

