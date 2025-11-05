"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Forum, ForumPost, ForumCategory } from "@/lib/types";
import { getForums, getForumPosts, createForum } from "@/lib/api-client/forums";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ForumList } from "@/components/forums/ForumList";
import { ForumDetail } from "@/components/forums/ForumDetail";
import { CreateForumDialog } from "@/components/forums/CreateForumDialog";
import { JoinForumDialog } from "@/components/forums/JoinForumDialog";

function ForumsPageContent() {
  const searchParams = useSearchParams();
  const [forums, setForums] = useState<Forum[]>([]);
  const [selectedForumId, setSelectedForumId] = useState<string | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loadingForums, setLoadingForums] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [errorForums, setErrorForums] = useState<string | null>(null);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  useEffect(() => {
    loadForums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedForumId) {
      loadPosts(selectedForumId);
    } else {
      setPosts([]);
    }
  }, [selectedForumId]);

  async function loadForums() {
    setLoadingForums(true);
    setErrorForums(null);
    try {
      const results = await getForums();
      setForums(results);
      
      // Check for forum query parameter first (from dashboard links)
      const forumParam = searchParams.get('forum');
      if (forumParam && results.some(f => f.id === forumParam)) {
        setSelectedForumId(forumParam);
      } else if (results.length > 0 && !selectedForumId) {
        // Auto-select first forum if no query param
        setSelectedForumId(results[0].id);
      }
    } catch (error) {
      console.error("Failed to load forums:", error);
      setErrorForums(error instanceof Error ? error.message : "Failed to load forums");
    } finally {
      setLoadingForums(false);
    }
  }

  async function loadPosts(forumId: string) {
    setLoadingPosts(true);
    setErrorPosts(null);
    try {
      const results = await getForumPosts(forumId);
      setPosts(results);
    } catch (error) {
      console.error("Failed to load posts:", error);
      setErrorPosts(error instanceof Error ? error.message : "Failed to load posts");
    } finally {
      setLoadingPosts(false);
    }
  }

  async function handleCreateForum(data: { title: string; category: ForumCategory; description: string }) {
    try {
      const newForum = await createForum(data);
      // Refresh forums list
      await loadForums();
      // Auto-select the new forum
      setSelectedForumId(newForum.id);
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create forum:", error);
      alert("Failed to create forum. Please try again.");
    }
  }

  function handleCreatePost() {
    // TODO: Implement in Phase 2
    alert("Create post functionality coming soon!");
  }

  const selectedForum = forums.find(f => f.id === selectedForumId) || null;

  return (
    <DashboardLayout activeRoute="/forums">
      <div className="flex h-[calc(100vh-8rem)] border rounded-lg overflow-hidden">
        {/* Left Panel - 15% */}
        <div className="w-[15%] bg-background">
          {loadingForums ? (
            <div className="p-4 text-center text-muted-foreground">Loading forums...</div>
          ) : errorForums ? (
            <div className="p-4 text-center">
              <p className="text-sm text-destructive mb-2">{errorForums}</p>
              <button
                onClick={loadForums}
                className="text-xs text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <ForumList
              forums={forums}
              selectedForumId={selectedForumId}
              onSelectForum={setSelectedForumId}
              onCreateForumClick={() => setCreateDialogOpen(true)}
              onJoinForumClick={() => setJoinDialogOpen(true)}
            />
          )}
        </div>

        {/* Right Panel - 85% */}
        <div className="flex-1 bg-background">
          {errorPosts ? (
            <div className="p-4 text-center">
              <p className="text-destructive mb-2">{errorPosts}</p>
              {selectedForumId && (
                <button
                  onClick={() => loadPosts(selectedForumId)}
                  className="text-sm text-primary hover:underline"
                >
                  Try again
                </button>
              )}
            </div>
          ) : (
            <ForumDetail
              forum={selectedForum}
              posts={posts}
              loading={loadingPosts}
              onCreatePost={handleCreatePost}
            />
          )}
        </div>
      </div>
      <CreateForumDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateForum}
      />
      <JoinForumDialog
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
        forums={forums}
        onSelectForum={setSelectedForumId}
      />
    </DashboardLayout>
  );
}

export default function ForumsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout activeRoute="/forums">
        <div className="p-4 text-center text-muted-foreground">Loading forums...</div>
      </DashboardLayout>
    }>
      <ForumsPageContent />
    </Suspense>
  );
}
