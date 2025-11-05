import { Organization, OrgType } from "../types";
import { prisma } from "../prisma";
import { prismaOrgToTypeScript } from "../db-transformers";

export interface OrganizationFilters {
  type?: OrgType[];
  search?: string;
}

/**
 * Get all organizations with optional filtering
 */
export async function getOrganizations(filters?: OrganizationFilters): Promise<Organization[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    const where: any = {};

    // Filter by org type - need to check if JSON array contains any of the filter types
    if (filters?.type && filters.type.length > 0) {
      // SQLite doesn't have native JSON support, so we need to use string matching
      // This is a limitation - for better performance, consider PostgreSQL with native JSON support
      const typeConditions = filters.type.map(type => ({
        type: {
          contains: type,
        },
      }));
      where.OR = typeConditions;
    }

    // Search by name, description, location, resources offered, or current needs
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      // SQLite's LIKE is case-insensitive by default, but we'll use contains for simplicity
      const searchConditions = [
        { name: { contains: searchLower } },
        { description: { contains: searchLower } },
        { location: { contains: searchLower } },
        { resourcesOffered: { contains: searchLower } },
        { currentNeedsInternal: { contains: searchLower } },
      ];

      // Combine with existing OR conditions if type filter exists
      if (where.OR) {
        where.AND = [
          { OR: where.OR },
          { OR: searchConditions },
        ];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    const orgs = await prisma.organization.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return orgs.map(prismaOrgToTypeScript);
  } catch (error: any) {
    throw new Error(`Failed to fetch organizations: ${error.message}`);
  }
}

/**
 * Get a single organization by ID
 */
export async function getOrganization(id: string): Promise<Organization | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  try {
    const org = await prisma.organization.findUnique({
      where: { id },
    });

    if (!org) {
      return null;
    }

    return prismaOrgToTypeScript(org);
  } catch (error: any) {
    throw new Error(`Failed to fetch organization: ${error.message}`);
  }
}

/**
 * Get unique values for org types (for filter UI)
 */
export function getOrgTypes(): OrgType[] {
  return ["nonprofit", "public_library", "community_center", "grassroots", "arts_venue", "other"];
}

/**
 * Create a new organization and link it to a user
 */
export interface CreateOrganizationInput {
  name: string;
  type: OrgType[];
  description: string;
  website?: string;
  email?: string;
  location?: string;
  contactInternal: string;
  currentNeedsInternal?: string;
  resourcesOffered?: string;
}

export async function createOrganization(
  input: CreateOrganizationInput,
  userId: string
): Promise<Organization> {
  try {
    // Validate required fields
    if (!input.name.trim()) {
      throw new Error("Organization name is required");
    }
    if (!input.type || input.type.length === 0) {
      throw new Error("At least one organization type is required");
    }
    if (!input.description.trim()) {
      throw new Error("Organization description is required");
    }
    if (!input.contactInternal.trim()) {
      throw new Error("Contact information is required");
    }

    // Check if organization name already exists
    const existingOrg = await prisma.organization.findFirst({
      where: { name: { equals: input.name, mode: 'insensitive' } },
    });

    if (existingOrg) {
      throw new Error("An organization with this name already exists");
    }

    // Create organization and link user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the organization
      const org = await tx.organization.create({
        data: {
          name: input.name.trim(),
          type: JSON.stringify(input.type),
          description: input.description.trim(),
          website: input.website?.trim() || null,
          email: input.email?.trim() || null,
          location: input.location?.trim() || null,
          contactInternal: input.contactInternal.trim(),
          currentNeedsInternal: input.currentNeedsInternal?.trim() || "",
          resourcesOffered: input.resourcesOffered?.trim() || "",
        },
      });

      // Link user to organization
      await tx.user.update({
        where: { id: userId },
        data: { organizationId: org.id },
      });

      return org;
    });

    return prismaOrgToTypeScript(result);
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      throw error; // Re-throw validation errors as-is
    }
    throw new Error(`Failed to create organization: ${error.message}`);
  }
}

/**
 * Join an existing organization (update user's organizationId)
 */
export async function joinOrganization(organizationId: string, userId: string): Promise<Organization> {
  try {
    // Verify organization exists
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      throw new Error("Organization not found");
    }

    // Update user's organizationId
    await prisma.user.update({
      where: { id: userId },
      data: { organizationId },
    });

    return prismaOrgToTypeScript(org);
  } catch (error: any) {
    if (error.message.includes("not found")) {
      throw error; // Re-throw validation errors as-is
    }
    throw new Error(`Failed to join organization: ${error.message}`);
  }
}
