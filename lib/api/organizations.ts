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


