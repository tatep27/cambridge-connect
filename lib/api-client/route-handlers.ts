/**
 * API route handler utilities
 */

import { NextResponse } from 'next/server';
import { ApiResponse, createSuccessResponse, createErrorResponse, ApiErrorCode } from './types';

/**
 * Create a successful HTTP response
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(createSuccessResponse(data), { status });
}

/**
 * Create an error HTTP response
 */
export function errorResponse(
  message: string,
  status: number = 500,
  code?: ApiErrorCode
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(createErrorResponse(message, code), { status });
}

/**
 * Create a 404 Not Found response
 */
export function notFoundResponse(message: string = 'Resource not found'): NextResponse<ApiResponse<never>> {
  return errorResponse(message, 404, ApiErrorCode.NOT_FOUND);
}

/**
 * Create a 400 Bad Request response
 */
export function badRequestResponse(message: string = 'Bad request'): NextResponse<ApiResponse<never>> {
  return errorResponse(message, 400, ApiErrorCode.BAD_REQUEST);
}

/**
 * Create a 201 Created response
 */
export function createdResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return successResponse(data, 201);
}

/**
 * Handle API route errors
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse<never>> {
  if (error instanceof BadRequestError) {
    return badRequestResponse(error.message);
  }
  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }
  return errorResponse('An unexpected error occurred', 500);
}

/**
 * Parse request body with error handling
 */
export async function parseRequestBody<T>(request: Request): Promise<T> {
  try {
    const body = await request.json();
    return body as T;
  } catch (error) {
    throw new BadRequestError('Invalid JSON in request body');
  }
}

/**
 * Custom error class for bad requests
 */
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}


