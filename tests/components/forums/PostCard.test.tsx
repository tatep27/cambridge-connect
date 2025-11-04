import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostCard } from '@/components/forums/PostCard';
import { ForumPostWithForum } from '@/lib/types';

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockPost: ForumPostWithForum = {
  id: 'post-1',
  forumId: 'forum-1',
  authorOrgId: 'org-1',
  authorOrgName: 'Test Organization',
  title: 'Test Post Title',
  content: 'This is a short post.',
  createdAt: '2024-01-28',
  replyCount: 2,
  forumTitle: 'Space Sharing',
  forumCategory: 'space_sharing',
};

const mockLongPost: ForumPostWithForum = {
  ...mockPost,
  id: 'post-2',
  content: 'This is a very long post that should be truncated because it exceeds the character limit that we have set for displaying posts in the dashboard. '.repeat(3),
};

const mockPostNoReplies: ForumPostWithForum = {
  ...mockPost,
  id: 'post-3',
  replyCount: 0,
};

describe('PostCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render post title', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('should render author organization', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Test Organization')).toBeInTheDocument();
  });

  it('should render forum title', () => {
    render(<PostCard post={mockPost} />);
    // There are two "Space Sharing" elements - badge and link
    const allSpaceSharing = screen.getAllByText('Space Sharing');
    expect(allSpaceSharing.length).toBe(2); // Badge and link
  });

  it('should render forum category badge', () => {
    render(<PostCard post={mockPost} />);
    // Badge shows formatted category - there should be 2 "Space Sharing" elements (badge and link)
    const allElements = screen.getAllByText('Space Sharing');
    // The first one should be the badge (div), not the link (a)
    const badge = allElements.find(el => el.tagName === 'DIV');
    expect(badge).toBeInTheDocument();
  });

  it('should render full content for short posts', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('This is a short post.')).toBeInTheDocument();
    expect(screen.queryByText(/Read more/)).not.toBeInTheDocument();
  });

  it('should truncate long content and show read more', () => {
    render(<PostCard post={mockLongPost} />);
    expect(screen.getByText(/Read more/)).toBeInTheDocument();
    // Should not show full content
    expect(screen.queryByText(mockLongPost.content)).not.toBeInTheDocument();
  });

  it('should expand content when read more is clicked', async () => {
    const user = userEvent.setup();
    render(<PostCard post={mockLongPost} />);
    
    const readMoreButton = screen.getByText(/Read more/);
    await user.click(readMoreButton);
    
    expect(screen.getByText(/Read less/)).toBeInTheDocument();
  });

  it('should show reply count when there are replies', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/2 replies/)).toBeInTheDocument();
  });

  it('should show singular reply text for one reply', () => {
    const singleReplyPost = { ...mockPost, replyCount: 1 };
    render(<PostCard post={singleReplyPost} />);
    expect(screen.getByText(/1 reply/)).toBeInTheDocument();
  });

  it('should not show reply count when there are no replies', () => {
    render(<PostCard post={mockPostNoReplies} />);
    expect(screen.queryByText(/reply/)).not.toBeInTheDocument();
  });

  it('should have link to view post in forum', () => {
    render(<PostCard post={mockPost} />);
    const viewLink = screen.getByText(/View in forum/);
    expect(viewLink.closest('a')).toHaveAttribute('href', '/forums?forum=forum-1');
  });

  it('should format date correctly', () => {
    const todayPost = {
      ...mockPost,
      createdAt: new Date().toISOString().split('T')[0],
    };
    render(<PostCard post={todayPost} />);
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('should format forum category correctly', () => {
    const partnershipPost = {
      ...mockPost,
      forumCategory: 'partnerships',
      forumTitle: 'Partnership Opportunities',
    };
    render(<PostCard post={partnershipPost} />);
    // Category should be formatted from snake_case to Title Case
    expect(screen.getByText('Partnerships')).toBeInTheDocument();
  });

  it('should link forum title to forums page', () => {
    render(<PostCard post={mockPost} />);
    // Find the link element (not the badge)
    const forumLink = screen.getByRole('link', { name: 'Space Sharing' });
    expect(forumLink).toHaveAttribute('href', '/forums?forum=forum-1');
  });
});

