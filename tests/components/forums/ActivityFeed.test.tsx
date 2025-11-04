import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityFeed } from '@/components/forums/ActivityFeed';
import { ForumPostWithForum } from '@/lib/types';

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockPosts: ForumPostWithForum[] = [
  {
    id: 'post-1',
    forumId: 'forum-1',
    authorOrgId: 'org-1',
    authorOrgName: 'Test Organization',
    title: 'First Post',
    content: 'First post content',
    createdAt: '2024-01-28',
    replyCount: 2,
    forumTitle: 'Space Sharing',
    forumCategory: 'space_sharing',
  },
  {
    id: 'post-2',
    forumId: 'forum-2',
    authorOrgId: 'org-2',
    authorOrgName: 'Another Organization',
    title: 'Second Post',
    content: 'Second post content',
    createdAt: '2024-01-27',
    replyCount: 0,
    forumTitle: 'Volunteer Recruitment',
    forumCategory: 'volunteers',
  },
];

describe('ActivityFeed', () => {
  it('should render loading state', () => {
    render(<ActivityFeed posts={[]} loading={true} />);
    // Should show skeleton loaders
    const skeletons = screen.getAllByRole('generic').filter(el => 
      el.classList.contains('animate-pulse')
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render empty state when no posts', () => {
    render(<ActivityFeed posts={[]} loading={false} />);
    expect(screen.getByText('No recent activity')).toBeInTheDocument();
    expect(screen.getByText(/Check back later or start a conversation/)).toBeInTheDocument();
  });

  it('should render all posts when provided', () => {
    render(<ActivityFeed posts={mockPosts} loading={false} />);
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });

  it('should render post cards in order', () => {
    render(<ActivityFeed posts={mockPosts} loading={false} />);
    const cards = screen.getAllByText(/Post/);
    expect(cards[0]).toHaveTextContent('First Post');
    expect(cards[1]).toHaveTextContent('Second Post');
  });

  it('should not show loading state when loading is false', () => {
    render(<ActivityFeed posts={mockPosts} loading={false} />);
    const skeletons = screen.queryAllByRole('generic').filter(el => 
      el.classList.contains('animate-pulse')
    );
    expect(skeletons.length).toBe(0);
  });

  it('should not show empty state when there are posts', () => {
    render(<ActivityFeed posts={mockPosts} loading={false} />);
    expect(screen.queryByText('No recent activity')).not.toBeInTheDocument();
  });
});

