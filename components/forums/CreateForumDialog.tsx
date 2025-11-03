"use client";

import { useState } from "react";
import { ForumCategory } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateForumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; category: ForumCategory; description: string }) => void;
}

const FORUM_CATEGORIES: { value: ForumCategory; label: string }[] = [
  { value: "space_sharing", label: "Space Sharing" },
  { value: "volunteers", label: "Volunteer Recruitment" },
  { value: "events", label: "Community Events" },
  { value: "partnerships", label: "Partnership Opportunities" },
  { value: "resources", label: "Resources & Equipment" },
  { value: "general", label: "General Discussion" },
];

export function CreateForumDialog({ open, onOpenChange, onSubmit }: CreateForumDialogProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ForumCategory | "">("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ title?: string; category?: string; description?: string }>({});

  function validate() {
    const newErrors: { title?: string; category?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (title.trim().length > 50) {
      newErrors.title = "Title must be 50 characters or less";
    }

    if (!category) {
      newErrors.category = "Category is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    } else if (description.trim().length > 200) {
      newErrors.description = "Description must be 200 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        title: title.trim(),
        category: category as ForumCategory,
        description: description.trim(),
      });
      // Reset form
      setTitle("");
      setCategory("");
      setDescription("");
      setErrors({});
      onOpenChange(false);
    }
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      // Reset form when closing
      setTitle("");
      setCategory("");
      setDescription("");
      setErrors({});
    }
    onOpenChange(newOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Forum</DialogTitle>
          <DialogDescription>
            Create a new discussion forum for Cambridge organizations
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Community Garden Exchange"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category *
              </label>
              <Select value={category} onValueChange={(value) => setCategory(value as ForumCategory)}>
                <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {FORUM_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what this forum is for..."
                rows={4}
                className={errors.description ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/200 characters
              </p>
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Forum</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

