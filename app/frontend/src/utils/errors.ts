import { PredictionFormData } from '@/types/prediction';

export interface ApiErrorResponse {
  status?: number;
  statusCode?: number;
  message?: string;
  detail?: string;
  code?: string;
}

/**
 * Normalizes any error thrown during prediction into a user-friendly, safe message.
 * Adheres to RouteRight AI error guidance:
 * - 400 validation error: Show backend message when safe and helpful
 * - 422 schema error: "Some ticket details are invalid. Please review the form."
 * - 500 server/model error: "Prediction service encountered a problem. Please try again."
 * - Network unavailable: "Could not reach prediction service. Check the connection and retry."
 * - Timeout: "Prediction service is taking too long. Please retry."
 * - Unexpected response: "We received an unexpected response. Please retry."
 *
 * Technical stack traces are never exposed to end-users.
 */
export const normalizePredictionError = (error: unknown): string => {
  if (!error) {
    return 'We received an unexpected response. Please retry.';
  }

  // Handle known error structures or Axios/fetch response wrappers
  const errObj = error as {
    status?: number;
    statusCode?: number;
    name?: string;
    message?: string;
    response?: { status?: number; data?: ApiErrorResponse | string };
    code?: string;
  };

  const status =
    errObj.response?.status ??
    errObj.status ??
    errObj.statusCode;

  // 1. HTTP 422 Unprocessable Entity / Schema Error
  if (status === 422) {
    return 'Some ticket details are invalid. Please review the form.';
  }

  // 2. HTTP 400 Bad Request / Validation Error
  if (status === 400) {
    const responseData = errObj.response?.data;
    if (typeof responseData === 'object' && responseData !== null) {
      const msg = responseData.message || responseData.detail;
      if (typeof msg === 'string' && msg.trim().length > 0 && !msg.includes('at ') && !msg.includes('Traceback')) {
        return msg;
      }
    }
    if (errObj.message && !errObj.message.includes('400') && !errObj.message.includes('at ') && !errObj.message.includes('Traceback')) {
      return errObj.message;
    }
    return 'Some ticket details are invalid. Please review the form.';
  }

  // 3. HTTP 500 Server / Model Error
  if (typeof status === 'number' && status >= 500 && status < 600) {
    return 'Prediction service encountered a problem. Please try again.';
  }

  // 4. Timeout Errors (AbortError, ECONNABORTED, timeout strings)
  const isTimeout =
    errObj.name === 'AbortError' ||
    errObj.name === 'TimeoutError' ||
    errObj.code === 'ECONNABORTED' ||
    (typeof errObj.message === 'string' &&
      (errObj.message.toLowerCase().includes('timeout') ||
        errObj.message.toLowerCase().includes('timed out')));

  if (isTimeout) {
    return 'Prediction service is taking too long. Please retry.';
  }

  // 5. Network Unavailable
  const isNetwork =
    errObj.name === 'NetworkError' ||
    errObj.code === 'ERR_NETWORK' ||
    (typeof errObj.message === 'string' &&
      (errObj.message.toLowerCase().includes('network') ||
        errObj.message.toLowerCase().includes('failed to fetch') ||
        errObj.message.toLowerCase().includes('could not reach') ||
        errObj.message.toLowerCase().includes('connection refused')));

  if (isNetwork) {
    return 'Could not reach prediction service. Check the connection and retry.';
  }

  // Fallback for generic JS errors without leaking stack trace
  if (errObj.message && !errObj.message.includes('at ') && !errObj.message.includes('Traceback')) {
    // If it's a specific user-facing validation message from mock
    if (errObj.message.includes('invalid') || errObj.message.includes('required')) {
      return errObj.message;
    }
  }

  // 6. Unexpected Response
  return 'We received an unexpected response. Please retry.';
};

/**
 * Basic privacy protection: Sanitizes ticket payloads before any logging.
 * In production, complete ticket details with staff IDs, caller IDs, or free-text details
 * are never dumped directly to console.
 */
export const sanitizePayloadForLogging = (payload: PredictionFormData): Record<string, string> => {
  return {
    category: payload.category || 'unknown',
    impact: payload.impact || 'unknown',
    urgency: payload.urgency || 'unknown',
    priority: payload.priority || 'unknown',
    assignment_group: payload.assignment_group ? '[PROTECTED_TARGET_QUEUE]' : 'unknown',
    opened_by: payload.opened_by ? '[PROTECTED_STAFF_ID]' : 'unknown',
    caller_id: payload.caller_id ? '[PROTECTED_CALLER_ID]' : 'unknown',
    timestamp: new Date().toISOString(),
  };
};
