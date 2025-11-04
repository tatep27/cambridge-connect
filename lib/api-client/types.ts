/**
 * Standard API response format
 */
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * API error codes
 */
export enum ApiErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

/**
 * Create a successful API response
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return { data };
}

/**
 * Create an error API response
 */
export function createErrorResponse(
  message: string,
  code?: ApiErrorCode
): ApiResponse<never> {
  return {
    error: {
      message,
      code: code || ApiErrorCode.INTERNAL_ERROR,
    },
  };
}

/**
 * Parse query parameters from Next.js request
 */
export function parseQueryParams(searchParams: URLSearchParams): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};
  
  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      // Convert to array if multiple values
      const existing = params[key];
      params[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      params[key] = value;
    }
  }
  
  return params;
}

/**
 * Parse array query parameter (e.g., ?type=nonprofit&type=community_center)
 */
export function parseArrayParam(param: string | string[] | undefined): string[] {
  if (!param) return [];
  return Array.isArray(param) ? param : [param];
}

