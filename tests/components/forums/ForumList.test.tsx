import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ForumList } from '@/components/forums/ForumList';
import { Forum } from '@/lib/types';

const mockForums: Forum[] = [
  {
    id: 'forum-1',
    title: 'Space Sharing',
    category: 'space_sharing',
    description: 'Test description',
    createdAt: '2024-01-15',
    postCount: 12,
    lastActivity: '2024-01-28',
    memberCount: 24,
    messagesToday: 3,
  },
  {
    id: 'forum-2',
    title: 'Volunteer Recruitment',
    category: 'volunteers',
    description: 'Test description',
    createdAt: '2024-01-15',
    postCount: 8,
    lastActivity: '2024-01-30',
    memberCount: 18,
    messagesToday: 2,
  },
];

describe('ForumList', () => {
  const mockOnCreateForumClick = vi.fn();
  const mockOnJoinForumClick = vi.fn();

  it('should render forum titles', () => {
    const onSelectForum = vi.fn();
    render(<ForumList forums={mockForums} selectedForumId={null} onSelectForum={onSelectForum} onCreateForumClick={mockOnCreateForumClick} onJoinForumClick={mockOnJoinForumClick} />);
    expect(screen.getByText('Space Sharing')).toBeInTheDocument();
    expect(screen.getByText('Volunteer Recruitment')).toBeInTheDocument();
  });

  it('should display member counts', () => {
    const onSelectForum = vi.fn();
    render(<ForumList forums={mockForums} selectedForumId={null} onSelectForum={onSelectForum} onCreateForumClick={mockOnCreateForumClick} onJoinForumClick={mockOnJoinForumClick} />);
    expect(screen.getByText(/24 members/)).toBeInTheDocument();
    expect(screen.getByText(/18 members/)).toBeInTheDocument();
  });

  it('should display messages today', () => {
    const onSelectForum = vi.fn();
    render(<ForumList forums={mockForums} selectedForumId={null} onSelectForum={onSelectForum} onCreateForumClick={mockOnCreateForumClick} onJoinForumClick={mockOnJoinForumClick} />);
    expect(screen.getByText(/3 messages today/)).toBeInTheDocument();
    expect(screen.getByText(/2 messages today/)).toBeInTheDocument();
  });

  it('should call onSelectForum when a forum is clicked', async () => {
    const user = userEvent.setup();
    const onSelectForum = vi.fn();
    render(<ForumList forums={mockForums} selectedForumId={null} onSelectForum={onSelectForum} onCreateForumClick={mockOnCreateForumClick} onJoinForumClick={mockOnJoinForumClick} />);
    
    const firstForum = screen.getByText('Space Sharing').closest('button');
    await user.click(firstForum!);
    
    expect(onSelectForum).toHaveBeenCalledWith('forum-1');
  });

  it('should highlight selected forum', () => {
    const onSelectForum = vi.fn();
    render(<ForumList forums={mockForums} selectedForumId="forum-1" onSelectForum={onSelectForum} onCreateForumClick={mockOnCreateForumClick} onJoinForumClick={mockOnJoinForumClick} />);
    
    const selectedButton = screen.getByText('Space Sharing').closest('button');
    expect(selectedButton).toHaveClass('bg-muted');
  });
});

