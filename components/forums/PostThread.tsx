"use client";

import { useState } from "react";
import { ForumPost, ForumReply } from "@/lib/types";
import { getPostReplies } from "@/lib/api/forums";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PostThreadProps {
  post: ForumPost;
}

const TRUNCATE_LENGTH = 150;

export function PostThread({ post }: PostThreadProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const isLongContent = post.content.length > TRUNCATE_LENGTH;
  const displayContent = isExpanded || !isLongContent 
    ? post.content 
    : post.content.substring(0, TRUNCATE_LENGTH) + "...";

  async function handleToggleReplies() {
    if (!showReplies && replies.length === 0) {
      setLoadingReplies(true);
      const fetchedReplies = await getPostReplies(post.id);
      setReplies(fetchedReplies);
      setLoadingReplies(false);
    }
    setShowReplies(!showReplies);
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{post.authorOrgName}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4 whitespace-pre-wrap">{displayContent}</p>
        {isLongContent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-4"
          >
            {isExpanded ? "Read less" : "Read more"}
          </Button>
        )}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleReplies}
            disabled={loadingReplies}
          >
            {showReplies ? "Hide" : "Show"} {post.replyCount} {post.replyCount === 1 ? "reply" : "replies"}
          </Button>
        </div>
        {showReplies && (
          <div className="mt-4 space-y-3 pl-4 border-l-2">
            {loadingReplies ? (
              <p className="text-sm text-muted-foreground">Loading replies...</p>
            ) : replies.length === 0 ? (
              <p className="text-sm text-muted-foreground">No replies yet.</p>
            ) : (
              replies.map((reply) => (
                <div key={reply.id} className="py-2">
                  <div className="text-sm">
                    <span className="font-medium">{reply.authorOrgName}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{formatDate(reply.createdAt)}</span>
                  </div>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{reply.content}</p>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

