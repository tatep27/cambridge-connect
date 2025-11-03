"use client";

import { useState } from "react";
import { Forum } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface JoinForumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forums: Forum[];
  onSelectForum: (forumId: string) => void;
}

export function JoinForumDialog({ open, onOpenChange, forums, onSelectForum }: JoinForumDialogProps) {
  const [search, setSearch] = useState("");

  const filteredForums = forums.filter(forum =>
    forum.title.toLowerCase().includes(search.toLowerCase()) ||
    forum.description.toLowerCase().includes(search.toLowerCase())
  );

  function handleJoinForum(forumId: string) {
    onSelectForum(forumId);
    setSearch("");
    onOpenChange(false);
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setSearch("");
    }
    onOpenChange(newOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Join a Forum</DialogTitle>
          <DialogDescription>
            Search for a forum to join and participate in discussions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Search forums by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredForums.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No forums found matching your search
              </p>
            ) : (
              filteredForums.map((forum) => (
                <div
                  key={forum.id}
                  className="p-4 border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{forum.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{forum.description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{forum.memberCount} members</span>
                        <span>{forum.messagesToday} messages today</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleJoinForum(forum.id)}
                      className="ml-4"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

