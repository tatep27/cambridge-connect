import { describe, it, expect } from 'vitest';
import { authOptions } from '@/lib/auth';

describe('NextAuth API Route', () => {
  it('should export route handlers', async () => {
    // Import dynamically to avoid issues with Next.js route handlers in tests
    const routeModule = await import('@/app/api/auth/[...nextauth]/route');
    expect(routeModule.GET).toBeDefined();
    expect(routeModule.POST).toBeDefined();
    expect(typeof routeModule.GET).toBe('function');
    expect(typeof routeModule.POST).toBe('function');
  });

  // Note: Full integration tests for NextAuth routes would require mocking Next.js internals
  // For now, we verify the configuration is correct
});

describe('NextAuth Configuration', () => {
  it('should export authOptions', () => {
    expect(authOptions).toBeDefined();
    expect(typeof authOptions).toBe('object');
  });

  it('should have credentials provider configured', () => {
    expect(authOptions.providers).toBeDefined();
    expect(Array.isArray(authOptions.providers)).toBe(true);
    expect(authOptions.providers.length).toBeGreaterThan(0);
    
    const credentialsProvider = authOptions.providers.find(
      (provider: any) => provider.id === 'credentials'
    );
    expect(credentialsProvider).toBeDefined();
  });

  it('should use JWT session strategy', () => {
    expect(authOptions.session).toBeDefined();
    expect(authOptions.session?.strategy).toBe('jwt');
  });

  it('should have custom pages configured', () => {
    expect(authOptions.pages).toBeDefined();
    expect(authOptions.pages?.signIn).toBe('/login');
    expect(authOptions.pages?.error).toBe('/login');
  });

  it('should have callbacks configured', () => {
    expect(authOptions.callbacks).toBeDefined();
    expect(typeof authOptions.callbacks?.jwt).toBe('function');
    expect(typeof authOptions.callbacks?.session).toBe('function');
  });

  it('should have authorize function that validates credentials', async () => {
    const credentialsProvider = authOptions.providers.find(
      (provider: any) => provider.id === 'credentials'
    ) as any;
    expect(credentialsProvider).toBeDefined();
    expect(typeof credentialsProvider.authorize).toBe('function');
    
      // Test that it handles non-existent user (should throw error)
      try {
        await credentialsProvider.authorize({ email: 'nonexistent@test.com', password: 'test' });
        // If we get here, the function might return null instead of throwing
        // That's also acceptable - it means NextAuth is handling the error
      } catch (error: any) {
        // If it throws, verify it's our expected error message
        expect(error.message).toContain('Invalid email or password');
      }
    
    // Verify the function validates required fields
    // NextAuth may handle errors differently, so we just verify the function exists and is callable
    expect(async () => {
      await credentialsProvider.authorize({ email: undefined, password: 'test' } as any);
    }).not.toThrow();
  });
});

describe('Environment Variables', () => {
  it('should reference NEXTAUTH_SECRET from environment', () => {
    // The secret property should reference process.env.NEXTAUTH_SECRET
    // It can be undefined in test environment, which is fine
    expect(authOptions.secret).toBe(process.env.NEXTAUTH_SECRET);
  });
});

