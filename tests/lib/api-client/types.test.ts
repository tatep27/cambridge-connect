import { describe, it, expect } from 'vitest';
import { createSuccessResponse, createErrorResponse, ApiErrorCode } from '@/lib/api-client/types';

describe('API Response Utilities', () => {
  it('should create a successful response', () => {
    const response = createSuccessResponse({ id: '1', name: 'Test' });
    expect(response.data).toEqual({ id: '1', name: 'Test' });
    expect(response.error).toBeUndefined();
  });

  it('should create an error response', () => {
    const response = createErrorResponse('Test error', ApiErrorCode.BAD_REQUEST);
    expect(response.error).toEqual({
      message: 'Test error',
      code: 'BAD_REQUEST',
    });
    expect(response.data).toBeUndefined();
  });

  it('should create error response with default code', () => {
    const response = createErrorResponse('Test error');
    expect(response.error?.code).toBe(ApiErrorCode.INTERNAL_ERROR);
  });
});

