import { Forum } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search } from "lucide-react";

interface ForumListProps {
  forums: Forum[];
  selectedForumId: string | null;
  onSelectForum: (forumId: string) => void;
  onCreateForumClick: () => void;
  onJoinForumClick: () => void;
}

export function ForumList({ forums, selectedForumId, onSelectForum, onCreateForumClick, onJoinForumClick }: ForumListProps) {
  return (
    <div className="h-full overflow-y-auto border-r">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Forums</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onJoinForumClick}>
              <Search className="mr-2 h-4 w-4" />
              Join a Forum
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCreateForumClick}>
              <Plus className="mr-2 h-4 w-4" />
              Create a Forum
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="divide-y">
        {forums.map((forum) => (
          <button
            key={forum.id}
            onClick={() => onSelectForum(forum.id)}
            className={cn(
              "w-full text-left p-4 hover:bg-muted transition-colors",
              selectedForumId === forum.id && "bg-muted border-l-2 border-primary"
            )}
          >
            <h3 className="font-medium mb-1">{forum.title}</h3>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>{forum.memberCount} members</p>
              <p>{forum.messagesToday} messages today</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

