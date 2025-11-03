import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ForumDetail } from '@/components/forums/ForumDetail';
import { Forum, ForumPost } from '@/lib/types';

const mockForum: Forum = {
  id: 'forum-1',
  title: 'Test Forum',
  category: 'space_sharing',
  description: 'Test forum description',
  createdAt: '2024-01-15',
  postCount: 5,
  lastActivity: '2024-01-28',
  memberCount: 24,
  messagesToday: 3,
};

const mockPosts: ForumPost[] = [
  {
    id: 'post-1',
    forumId: 'forum-1',
    authorOrgId: 'org-1',
    authorOrgName: 'Test Org',
    title: 'Test Post',
    content: 'Test content',
    createdAt: '2024-01-28',
    replyCount: 0,
  },
];

describe('ForumDetail', () => {
  it('should show empty state when no forum selected', () => {
    const onCreatePost = vi.fn();
    render(<ForumDetail forum={null} posts={[]} loading={false} onCreatePost={onCreatePost} />);
    expect(screen.getByText('Select a forum to view posts')).toBeInTheDocument();
  });

  it('should display forum title and description', () => {
    const onCreatePost = vi.fn();
    render(<ForumDetail forum={mockForum} posts={[]} loading={false} onCreatePost={onCreatePost} />);
    expect(screen.getByText('Test Forum')).toBeInTheDocument();
    expect(screen.getByText('Test forum description')).toBeInTheDocument();
  });

  it('should show create post button', () => {
    const onCreatePost = vi.fn();
    render(<ForumDetail forum={mockForum} posts={[]} loading={false} onCreatePost={onCreatePost} />);
    expect(screen.getByText('Create Post')).toBeInTheDocument();
  });

  it('should call onCreatePost when button is clicked', async () => {
    const user = userEvent.setup();
    const onCreatePost = vi.fn();
    render(<ForumDetail forum={mockForum} posts={[]} loading={false} onCreatePost={onCreatePost} />);
    
    const createButton = screen.getByText('Create Post');
    await user.click(createButton);
    
    expect(onCreatePost).toHaveBeenCalledOnce();
  });

  it('should show loading state', () => {
    const onCreatePost = vi.fn();
    render(<ForumDetail forum={mockForum} posts={[]} loading={true} onCreatePost={onCreatePost} />);
    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  });

  it('should show empty state when no posts', () => {
    const onCreatePost = vi.fn();
    render(<ForumDetail forum={mockForum} posts={[]} loading={false} onCreatePost={onCreatePost} />);
    expect(screen.getByText('No posts yet')).toBeInTheDocument();
    expect(screen.getByText('Be the first to start a discussion!')).toBeInTheDocument();
  });

  it('should display posts when available', () => {
    const onCreatePost = vi.fn();
    render(<ForumDetail forum={mockForum} posts={mockPosts} loading={false} onCreatePost={onCreatePost} />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test Org')).toBeInTheDocument();
  });
});

