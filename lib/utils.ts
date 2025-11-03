import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert an array of strings to a readable display format
 * Example: ["space", "expertise", "connections"] -> "Space • Expertise • Connections"
 */
export function formatArrayDisplay(items: string[]): string {
  if (items.length === 0) return "";
  
  return items
    .map(item => {
      // Capitalize and replace underscores with spaces
      return item
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    })
    .join(' • ');
}

