"use client";

import { useEffect, useState } from "react";
import { ForumPostWithForum } from "@/lib/types";
import { getRecentActivity } from "@/lib/api-client/forums";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ActivityFeed } from "@/components/forums/ActivityFeed";

export default function Dashboard() {
  const [posts, setPosts] = useState<ForumPostWithForum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  async function loadRecentActivity() {
    setLoading(true);
    setError(null);
    try {
      const recentPosts = await getRecentActivity(10);
      setPosts(recentPosts);
    } catch (error) {
      console.error("Failed to load recent activity:", error);
      setError(error instanceof Error ? error.message : "Failed to load recent activity");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout activeRoute="/dashboard">
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Recent activity from across all forums
          </p>
        </div>
        {error ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-2">Error: {error}</p>
            <button
              onClick={loadRecentActivity}
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <ActivityFeed posts={posts} loading={loading} />
        )}
      </div>
    </DashboardLayout>
  );
}
