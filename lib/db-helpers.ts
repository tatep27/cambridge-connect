/**
 * Database helper functions for Prisma integration
 * 
 * These functions help convert between Prisma database types and TypeScript types,
 * particularly for handling JSON arrays in SQLite and date conversions.
 */

import { OrgType } from '@/lib/types';

/**
 * Convert OrgType[] array to JSON string for database storage
 */
export function serializeOrgTypes(types: OrgType[]): string {
  return JSON.stringify(types);
}

/**
 * Convert JSON string from database to OrgType[] array
 */
export function deserializeOrgTypes(typeString: string): OrgType[] {
  try {
    return JSON.parse(typeString) as OrgType[];
  } catch {
    // Fallback: if it's not valid JSON, try to parse as single type
    return [typeString as OrgType];
  }
}

/**
 * Convert DateTime to ISO date string (YYYY-MM-DD)
 */
export function formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Convert ISO date string to Date object
 */
export function parseDateFromApi(dateString: string): Date {
  return new Date(dateString);
}

