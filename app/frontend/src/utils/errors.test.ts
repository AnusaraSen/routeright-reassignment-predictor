import { describe, it, expect } from 'vitest';
import { normalizePredictionError, sanitizePayloadForLogging } from './errors';
import { PredictionFormData } from '@/types/prediction';

describe('Error Normalization Utility (normalizePredictionError)', () => {
  it('returns backend message for 400 validation error when safe and helpful', () => {
    const error400 = {
      status: 400,
      response: {
        data: {
          message: 'Target queue is not accepting new incident dispatches.',
        },
      },
    };
    expect(normalizePredictionError(error400)).toBe(
      'Target queue is not accepting new incident dispatches.'
    );
  });

  it('returns friendly schema message for 422 schema error', () => {
    const error422 = {
      status: 422,
      response: {
        data: {
          detail: 'Unprocessable Entity: schema validation failed',
        },
      },
    };
    expect(normalizePredictionError(error422)).toBe(
      'Some ticket details are invalid. Please review the form.'
    );
  });

  it('returns problem message for 500 server/model error', () => {
    const error500 = {
      status: 500,
      message: 'Internal server error at line 145 in triage_model.py',
    };
    expect(normalizePredictionError(error500)).toBe(
      'Prediction service encountered a problem. Please try again.'
    );
  });

  it('returns network message when connection cannot be established', () => {
    const networkError = new TypeError('Failed to fetch');
    expect(normalizePredictionError(networkError)).toBe(
      'Could not reach prediction service. Check the connection and retry.'
    );

    const axiosNetworkErr = { code: 'ERR_NETWORK', message: 'Network Error' };
    expect(normalizePredictionError(axiosNetworkErr)).toBe(
      'Could not reach prediction service. Check the connection and retry.'
    );
  });

  it('returns timeout message when request takes too long', () => {
    const timeoutErr = { code: 'ECONNABORTED', message: 'timeout of 5000ms exceeded' };
    expect(normalizePredictionError(timeoutErr)).toBe(
      'Prediction service is taking too long. Please retry.'
    );

    const abortErr = new DOMException('The operation was aborted due to timeout', 'AbortError');
    expect(normalizePredictionError(abortErr)).toBe(
      'Prediction service is taking too long. Please retry.'
    );
  });

  it('returns unexpected response message for unknown or malformed errors', () => {
    expect(normalizePredictionError(null)).toBe('We received an unexpected response. Please retry.');
    expect(normalizePredictionError({})).toBe('We received an unexpected response. Please retry.');
  });

  it('never leaks stack traces to users', () => {
    const stackTraceError = new Error('at Object.eval (bundle.js:10:20)\nTraceback (most recent call last)');
    const result = normalizePredictionError(stackTraceError);
    expect(result).not.toContain('at ');
    expect(result).not.toContain('Traceback');
    expect(result).toBe('We received an unexpected response. Please retry.');
  });
});

describe('Privacy Protection (sanitizePayloadForLogging)', () => {
  it('masks sensitive staff IDs, caller IDs, and target queues', () => {
    const rawPayload: PredictionFormData = {
      caller_id: 'User 1234',
      opened_at: '2026-10-02T10:00',
      opened_by: 'Opened by  17',
      contact_type: 'Phone',
      location: 'Location 143',
      category: 'Category 26',
      subcategory: 'Subcategory 170',
      u_symptom: 'Symptom 491',
      impact: '1 - High',
      urgency: '1 - High',
      priority: '2 - High',
      assignment_group: 'Group 70',
    };

    const sanitized = sanitizePayloadForLogging(rawPayload);

    expect(sanitized.caller_id).toBe('[PROTECTED_CALLER_ID]');
    expect(sanitized.opened_by).toBe('[PROTECTED_STAFF_ID]');
    expect(sanitized.assignment_group).toBe('[PROTECTED_TARGET_QUEUE]');
    expect(sanitized.category).toBe('Category 26');
    expect(sanitized.timestamp).toBeDefined();
  });
});
