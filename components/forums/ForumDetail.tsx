import { Forum, ForumPost } from "@/lib/types";
import { PostThread } from "./PostThread";
import { Button } from "@/components/ui/button";

interface ForumDetailProps {
  forum: Forum | null;
  posts: ForumPost[];
  loading: boolean;
  onCreatePost: () => void;
}

export function ForumDetail({ forum, posts, loading, onCreatePost }: ForumDetailProps) {
  if (!forum) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg">Select a forum to view posts</p>
          <p className="text-sm mt-2">Choose a forum from the list on the left</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{forum.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{forum.description}</p>
        </div>
        <Button onClick={onCreatePost}>Create Post</Button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="text-center py-12">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">No posts yet</p>
            <p className="text-sm">Be the first to start a discussion!</p>
            <Button onClick={onCreatePost} className="mt-4">Create First Post</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostThread key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

