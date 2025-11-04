import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrganizationProfile } from '@/components/organizations/OrganizationProfile';
import { Organization } from '@/lib/types';

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockOrganization: Organization = {
  id: 'org-test',
  name: 'Test Organization',
  type: ['nonprofit', 'community_center'],
  description: 'This is a test organization that serves the community.',
  website: 'https://test.org',
  email: 'contact@test.org',
  location: '123 Main St, Cambridge, MA',
  contactInternal: 'John Doe, johndoe@test.org',
  currentNeedsInternal: 'We are looking for volunteers and space for our programs.',
  resourcesOffered: 'We offer community resources, space, and expertise.',
};

describe('OrganizationProfile', () => {
  it('should render organization name', () => {
    render(<OrganizationProfile organization={mockOrganization} />);
    expect(screen.getByText('Test Organization')).toBeInTheDocument();
  });

  it('should render organization types as badges', () => {
    render(<OrganizationProfile organization={mockOrganization} />);
    expect(screen.getByText('Nonprofit')).toBeInTheDocument();
    expect(screen.getByText('Community Center')).toBeInTheDocument();
  });

  it('should render location when provided', () => {
    render(<OrganizationProfile organization={mockOrganization} />);
    expect(screen.getByText('123 Main St, Cambridge, MA')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<OrganizationProfile organization={mockOrganization} />);
    expect(screen.getByText('This is a test organization that serves the community.')).toBeInTheDocument();
  });

  it('should render resources offered', () => {
    render(<OrganizationProfile organization={mockOrganization} />);
    expect(screen.getByText('We offer community resources, space, and expertise.')).toBeInTheDocument();
    expect(screen.getByText('Reach out to us if you need help with...')).toBeInTheDocument();
  });

  it('should render contact information', () => {
    render(<OrganizationProfile organization={mockOrganization} />);
    expect(screen.getByText('https://test.org')).toBeInTheDocument();
    expect(screen.getByText('contact@test.org')).toBeInTheDocument();
  });

  it('should render internal contact information', () => {
    render(<OrganizationProfile organization={mockOrganization} />);
    expect(screen.getByText('John Doe, johndoe@test.org')).toBeInTheDocument();
  });

  it('should render current needs as text', () => {
    render(<OrganizationProfile organization={mockOrganization} />);
    expect(screen.getByText('We are looking for volunteers and space for our programs.')).toBeInTheDocument();
    expect(screen.getByText('We could use some help with...')).toBeInTheDocument();
  });

  it('should have back link to organizations page', () => {
    render(<OrganizationProfile organization={mockOrganization} />);
    const backLink = screen.getByText(/Back to Organizations/i).closest('a');
    expect(backLink).toHaveAttribute('href', '/organizations');
  });

  it('should not render location section when location is missing', () => {
    const orgWithoutLocation = { ...mockOrganization, location: undefined };
    render(<OrganizationProfile organization={orgWithoutLocation} />);
    expect(screen.queryByText('MapPin')).not.toBeInTheDocument();
  });

  it('should not render website section when website is missing', () => {
    const orgWithoutWebsite = { ...mockOrganization, website: undefined };
    render(<OrganizationProfile organization={orgWithoutWebsite} />);
    expect(screen.queryByText('https://test.org')).not.toBeInTheDocument();
  });

  it('should not render needs section when needs are empty', () => {
    const orgWithoutNeeds = { ...mockOrganization, currentNeedsInternal: '' };
    render(<OrganizationProfile organization={orgWithoutNeeds} />);
    expect(screen.queryByText('We could use some help with...')).not.toBeInTheDocument();
  });
});

