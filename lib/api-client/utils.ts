/**
 * API Client utilities for making requests to Next.js API routes
 */

import { ApiResponse } from './types';

/**
 * Base API URL (empty string for same-origin requests)
 */
const API_BASE_URL = '';

/**
 * Get the base URL for API requests
 * In browser: uses window.location.origin
 * In server: uses process.env.NEXT_PUBLIC_APP_URL or defaults to http://localhost:3000
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Server-side fallback (shouldn't be needed for client components)
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Make a GET request to an API endpoint
 */
export async function apiGet<T>(
  endpoint: string,
  queryParams?: Record<string, string | string[] | undefined>
): Promise<T> {
  // Build URL with query parameters
  const baseUrl = getBaseUrl();
  const url = new URL(`${API_BASE_URL}${endpoint}`, baseUrl);
  
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, v));
        } else {
          url.searchParams.set(key, value);
        }
      }
    });
  }
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: { message: `HTTP ${response.status}: ${response.statusText}` },
    }));
    throw new Error(errorData.error?.message || 'Request failed');
  }
  
  const data: ApiResponse<T> = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message);
  }
  
  if (!data.data) {
    throw new Error('No data returned from API');
  }
  
  return data.data;
}

/**
 * Make a POST request to an API endpoint
 */
export async function apiPost<T>(
  endpoint: string,
  body: unknown
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: { message: `HTTP ${response.status}: ${response.statusText}` },
    }));
    throw new Error(errorData.error?.message || 'Request failed');
  }
  
  const data: ApiResponse<T> = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message);
  }
  
  if (!data.data) {
    throw new Error('No data returned from API');
  }
  
  return data.data;
}

