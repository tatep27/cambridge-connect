import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock LoginForm
vi.mock('@/components/auth/LoginForm', () => ({
  LoginForm: () => <div data-testid="login-form">Login Form</div>,
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Login Page', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  it('should show loading state while checking session', () => {
    (useSession as any).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<LoginPage />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should show login form when not authenticated', () => {
    (useSession as any).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<LoginPage />);
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByText(/cambridge connect/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
  });

  it('should redirect to dashboard when authenticated with organization', async () => {
    (useSession as any).mockReturnValue({
      data: {
        user: {
          id: 'user-1',
          email: 'test@example.com',
          organizationId: 'org-1',
        },
      },
      status: 'authenticated',
    });

    render(<LoginPage />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should redirect to onboarding when authenticated without organization', async () => {
    (useSession as any).mockReturnValue({
      data: {
        user: {
          id: 'user-1',
          email: 'test@example.com',
          organizationId: null,
        },
      },
      status: 'authenticated',
    });

    render(<LoginPage />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/onboarding');
    });
  });

  it('should show link to signup page', () => {
    (useSession as any).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<LoginPage />);
    
    const signupLink = screen.getByRole('link', { name: /sign up/i });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/signup');
  });
});

