"use client";

import { useState } from "react";
import { ForumPostWithForum } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface PostCardProps {
  post: ForumPostWithForum;
}

const TRUNCATE_LENGTH = 200;

export function PostCard({ post }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongContent = post.content.length > TRUNCATE_LENGTH;
  const displayContent = isExpanded || !isLongContent 
    ? post.content 
    : post.content.substring(0, TRUNCATE_LENGTH) + "...";

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  function formatCategory(category: string): string {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {formatCategory(post.forumCategory)}
              </Badge>
              <Link 
                href={`/forums?forum=${post.forumId}`}
                className="text-sm font-medium text-primary hover:underline truncate"
              >
                {post.forumTitle}
              </Link>
            </div>
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{post.authorOrgName}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(post.createdAt)}</span>
              {post.replyCount > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span>{post.replyCount} {post.replyCount === 1 ? 'reply' : 'replies'}</span>
                </>
              )}
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
            className="mb-2"
          >
            {isExpanded ? "Read less" : "Read more"}
          </Button>
        )}
        <div className="pt-2 border-t">
          <Link href={`/forums?forum=${post.forumId}`}>
            <Button variant="outline" size="sm">
              View in forum →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

