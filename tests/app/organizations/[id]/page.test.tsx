import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'next/navigation';
import OrganizationPage from '@/app/organizations/[id]/page';
import * as organizationsApi from '@/lib/api-client/organizations';

// Mock Next.js hooks
vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
}));

// Mock the API client
vi.mock('@/lib/api-client/organizations');
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

const mockOrganization = {
  id: 'org-1',
  name: 'Test Organization',
  type: ['nonprofit'],
  description: 'Test description',
  website: 'https://test.org',
  email: 'test@test.org',
  location: 'Cambridge, MA',
  contactInternal: 'Contact info',
  currentNeedsInternal: 'We are looking for volunteers.',
  resourcesOffered: 'Test resources',
};

describe('Organization Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(useParams).mockReturnValue({ id: 'org-1' });
    vi.mocked(organizationsApi.getOrganization).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<OrganizationPage />);
    expect(screen.getByText('Loading organization...')).toBeInTheDocument();
  });

  it('should render organization profile when loaded', async () => {
    vi.mocked(useParams).mockReturnValue({ id: 'org-1' });
    vi.mocked(organizationsApi.getOrganization).mockResolvedValue(mockOrganization);

    render(<OrganizationPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Organization')).toBeInTheDocument();
    });

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should call getOrganization with correct ID', async () => {
    vi.mocked(useParams).mockReturnValue({ id: 'org-1' });
    vi.mocked(organizationsApi.getOrganization).mockResolvedValue(mockOrganization);

    render(<OrganizationPage />);

    await waitFor(() => {
      expect(organizationsApi.getOrganization).toHaveBeenCalledWith('org-1');
    });
  });

  it('should render error when organization is not found', async () => {
    vi.mocked(useParams).mockReturnValue({ id: 'invalid-id' });
    vi.mocked(organizationsApi.getOrganization).mockRejectedValue(
      new Error('Organization with ID invalid-id not found')
    );

    render(<OrganizationPage />);

    await waitFor(() => {
      expect(screen.getByText('Organization not found')).toBeInTheDocument();
    });

    const backLink = screen.getByText(/Back to Organizations/i);
    expect(backLink.closest('a')).toHaveAttribute('href', '/organizations');
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(useParams).mockReturnValue({ id: 'org-1' });
    vi.mocked(organizationsApi.getOrganization).mockRejectedValue(new Error('API Error'));

    render(<OrganizationPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load organization')).toBeInTheDocument();
    });
  });

  it('should handle invalid ID parameter', async () => {
    vi.mocked(useParams).mockReturnValue({ id: undefined });

    render(<OrganizationPage />);

    await waitFor(() => {
      expect(screen.getByText('Invalid organization ID')).toBeInTheDocument();
    });
  });
});

