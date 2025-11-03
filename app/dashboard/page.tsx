"use client";

import { useEffect, useState } from "react";
import { ForumPostWithForum, getRecentActivity } from "@/lib/api/forums";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ActivityFeed } from "@/components/forums/ActivityFeed";

export default function Dashboard() {
  const [posts, setPosts] = useState<ForumPostWithForum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  async function loadRecentActivity() {
    setLoading(true);
    try {
      const recentPosts = await getRecentActivity(10);
      setPosts(recentPosts);
    } catch (error) {
      console.error("Failed to load recent activity:", error);
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
        <ActivityFeed posts={posts} loading={loading} />
      </div>
    </DashboardLayout>
  );
}
