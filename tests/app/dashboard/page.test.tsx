import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '@/app/dashboard/page';
import * as forumsApi from '@/lib/api/forums';

// Mock the API
vi.mock('@/lib/api/forums');
vi.mock('@/components/layout/DashboardLayout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockPosts = [
  {
    id: 'post-1',
    forumId: 'forum-1',
    authorOrgId: 'org-1',
    authorOrgName: 'Test Organization',
    title: 'Recent Post',
    content: 'This is a recent post',
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
    title: 'Another Post',
    content: 'Another post content',
    createdAt: '2024-01-27',
    replyCount: 0,
    forumTitle: 'Volunteer Recruitment',
    forumCategory: 'volunteers',
  },
];

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard title', () => {
    vi.mocked(forumsApi.getRecentActivity).mockResolvedValue(mockPosts);
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render dashboard description', () => {
    vi.mocked(forumsApi.getRecentActivity).mockResolvedValue(mockPosts);
    render(<Dashboard />);
    expect(screen.getByText(/Recent activity from across all forums/)).toBeInTheDocument();
  });

  it('should call getRecentActivity on mount', async () => {
    vi.mocked(forumsApi.getRecentActivity).mockResolvedValue(mockPosts);
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(forumsApi.getRecentActivity).toHaveBeenCalledWith(10);
    });
  });

  it('should render posts after loading', async () => {
    vi.mocked(forumsApi.getRecentActivity).mockResolvedValue(mockPosts);
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Post')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Another Post')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    let resolvePromise: (value: typeof mockPosts) => void;
    const promise = new Promise<typeof mockPosts>((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(forumsApi.getRecentActivity).mockReturnValue(promise);
    
    render(<Dashboard />);
    
    // Should show loading skeletons
    const skeletons = screen.getAllByRole('generic').filter(el => 
      el.classList.contains('animate-pulse')
    );
    expect(skeletons.length).toBeGreaterThan(0);
    
    // Resolve to continue
    resolvePromise!(mockPosts);
  });

  it('should show empty state when no posts', async () => {
    vi.mocked(forumsApi.getRecentActivity).mockResolvedValue([]);
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('No recent activity')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(forumsApi.getRecentActivity).mockRejectedValue(new Error('API Error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load recent activity:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });
});

