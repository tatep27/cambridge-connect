import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrganizationCard } from '@/components/organizations/OrganizationCard';
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
  description: 'Test description',
  website: 'https://test.org',
  email: 'test@test.org',
  location: 'Test Location',
  contactInternal: 'Test Contact',
  currentNeedsInternal: 'We are looking for volunteers and space for our programs.',
  resourcesOffered: 'We offer test resources to the community.',
};

describe('OrganizationCard', () => {
  it('should render organization name', () => {
    render(<OrganizationCard organization={mockOrganization} />);
    expect(screen.getByText('Test Organization')).toBeInTheDocument();
  });

  it('should render organization types', () => {
    render(<OrganizationCard organization={mockOrganization} />);
    expect(screen.getByText(/Nonprofit/)).toBeInTheDocument();
    expect(screen.getByText(/Community Center/)).toBeInTheDocument();
  });

  it('should render resources offered', () => {
    render(<OrganizationCard organization={mockOrganization} />);
    expect(screen.getByText('We offer test resources to the community.')).toBeInTheDocument();
  });

  it('should have link to organization profile', () => {
    render(<OrganizationCard organization={mockOrganization} />);
    const link = screen.getByText('Test Organization').closest('a');
    expect(link).toHaveAttribute('href', '/organizations/org-test');
  });

  it('should render with different organization data', () => {
    const differentOrg: Organization = {
      ...mockOrganization,
      id: 'org-different',
      name: 'Different Org',
      resourcesOffered: 'Different resources available.',
    };
    render(<OrganizationCard organization={differentOrg} />);
    expect(screen.getByText('Different Org')).toBeInTheDocument();
    expect(screen.getByText('Different resources available.')).toBeInTheDocument();
    const link = screen.getByText('Different Org').closest('a');
    expect(link).toHaveAttribute('href', '/organizations/org-different');
  });
});
