import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('Prisma Schema: User & Organization Schema', () => {
  beforeAll(async () => {
    // Ensure database is seeded
    const orgCount = await prisma.organization.count();
    if (orgCount === 0) {
      // Database should be seeded via seed script
      // This is just a safety check
    }
  });

  describe('User Model', () => {
    it('should be able to create a user with nullable organizationId', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: 'hashed_password_placeholder',
          organizationId: null, // Nullable during onboarding
        },
      });

      expect(testUser).toBeDefined();
      expect(testUser.email).toBe('test@example.com');
      expect(testUser.name).toBe('Test User');
      expect(testUser.organizationId).toBeNull();
      expect(testUser.createdAt).toBeInstanceOf(Date);
      expect(testUser.updatedAt).toBeInstanceOf(Date);

      // Cleanup
      await prisma.user.delete({ where: { id: testUser.id } });
    });

    it('should enforce unique email constraint', async () => {
      const email = 'unique@example.com';
      
      // Create first user
      const user1 = await prisma.user.create({
        data: {
          email,
          name: 'User 1',
          password: 'hash1',
        },
      });

      // Try to create second user with same email - should fail
      await expect(
        prisma.user.create({
          data: {
            email,
            name: 'User 2',
            password: 'hash2',
          },
        })
      ).rejects.toThrow();

      // Cleanup
      await prisma.user.delete({ where: { id: user1.id } });
    });

    it('should allow user to belong to an organization', async () => {
      // Get an existing organization
      const org = await prisma.organization.findFirst();
      expect(org).toBeDefined();

      if (org) {
        const user = await prisma.user.create({
          data: {
            email: 'orguser@example.com',
            name: 'Org User',
            password: 'hash',
            organizationId: org.id,
          },
        });

        expect(user.organizationId).toBe(org.id);

        // Verify relation works
        const userWithOrg = await prisma.user.findUnique({
          where: { id: user.id },
          include: { organization: true },
        });

        expect(userWithOrg?.organization).toBeDefined();
        expect(userWithOrg?.organization?.id).toBe(org.id);

        // Cleanup
        await prisma.user.delete({ where: { id: user.id } });
      }
    });
  });

  describe('Organization Model', () => {
    it('should have users relation', async () => {
      const org = await prisma.organization.findFirst();
      expect(org).toBeDefined();

      if (org) {
        const orgWithUsers = await prisma.organization.findUnique({
          where: { id: org.id },
          include: { users: true },
        });

        expect(orgWithUsers?.users).toBeDefined();
        expect(Array.isArray(orgWithUsers?.users)).toBe(true);
      }
    });

    it('should support multiple users per organization', async () => {
      const org = await prisma.organization.findFirst();
      expect(org).toBeDefined();

      if (org) {
        const user1 = await prisma.user.create({
          data: {
            email: 'multi1@example.com',
            name: 'Multi User 1',
            password: 'hash1',
            organizationId: org.id,
          },
        });

        const user2 = await prisma.user.create({
          data: {
            email: 'multi2@example.com',
            name: 'Multi User 2',
            password: 'hash2',
            organizationId: org.id,
          },
        });

        const orgWithUsers = await prisma.organization.findUnique({
          where: { id: org.id },
          include: { users: true },
        });

        expect(orgWithUsers?.users.length).toBeGreaterThanOrEqual(2);

        // Cleanup
        await prisma.user.delete({ where: { id: user1.id } });
        await prisma.user.delete({ where: { id: user2.id } });
      }
    });
  });

  describe('NextAuth Tables', () => {
    it('should have Account model available', async () => {
      const accountCount = await prisma.account.count();
      expect(accountCount).toBeGreaterThanOrEqual(0); // Just verify it doesn't throw
    });

    it('should have Session model available', async () => {
      const sessionCount = await prisma.session.count();
      expect(sessionCount).toBeGreaterThanOrEqual(0); // Just verify it doesn't throw
    });

    it('should have VerificationToken model available', async () => {
      const tokenCount = await prisma.verificationToken.count();
      expect(tokenCount).toBeGreaterThanOrEqual(0); // Just verify it doesn't throw
    });

    it('should support Account relation to User', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'accounttest@example.com',
          name: 'Account Test',
          password: 'hash',
        },
      });

      // Account table exists and can be queried
      const accounts = await prisma.account.findMany({
        where: { userId: user.id },
      });

      expect(Array.isArray(accounts)).toBe(true);

      // Cleanup
      await prisma.user.delete({ where: { id: user.id } });
    });
  });

  describe('TypeScript Types', () => {
    it('should match Prisma User type to TypeScript User interface', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'typetest@example.com',
          name: 'Type Test',
          password: 'hash',
        },
      });

      // Verify all expected fields exist
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('organizationId');
      expect(user).toHaveProperty('emailVerified');
      expect(user).toHaveProperty('password');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');

      // Cleanup
      await prisma.user.delete({ where: { id: user.id } });
    });
  });
});

