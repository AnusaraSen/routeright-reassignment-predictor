import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePrediction } from './usePrediction';
import * as mockApi from '@/mocks/prediction';
import { PredictionFormData } from '@/types/prediction';

vi.mock('@/mocks/prediction', () => ({
  mockPredict: vi.fn(),
}));

describe('usePrediction Hook', () => {
  const samplePayload: PredictionFormData = {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with idle status, null result, and null error', () => {
    const { result } = renderHook(() => usePrediction());

    expect(result.current.status).toBe('idle');
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('transitions to loading and then success with response on successful predict', async () => {
    const mockResponse = {
      prediction: 1 as const,
      label: 'Reassignment Required' as const,
      probability: 0.84,
      diagnosis: 'Test diagnosis',
    };

    vi.mocked(mockApi.mockPredict).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => usePrediction());

    let promise: Promise<unknown>;
    act(() => {
      promise = result.current.predict(samplePayload);
    });

    expect(result.current.status).toBe('loading');
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await promise;
    });

    expect(result.current.status).toBe('success');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.result).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
  });

  it('transitions to error on prediction failure', async () => {
    vi.mocked(mockApi.mockPredict).mockRejectedValueOnce(new Error('Inference server timeout'));

    const { result } = renderHook(() => usePrediction());

    await act(async () => {
      await result.current.predict(samplePayload);
    });

    expect(result.current.status).toBe('error');
    expect(result.current.isError).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Prediction service is taking too long. Please retry.');
    expect(result.current.result).toBeNull();
  });

  it('supports retry using stored last payload', async () => {
    vi.mocked(mockApi.mockPredict)
      .mockRejectedValueOnce(new Error('Network failure'))
      .mockResolvedValueOnce({
        prediction: 0,
        label: 'No Reassignment Required',
        probability: 0.15,
      });

    const { result } = renderHook(() => usePrediction());

    // First attempt fails
    await act(async () => {
      await result.current.predict(samplePayload);
    });
    expect(result.current.status).toBe('error');

    // Retry succeeds
    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.status).toBe('success');
    expect(result.current.result?.prediction).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('resets state back to idle on reset()', async () => {
    vi.mocked(mockApi.mockPredict).mockResolvedValueOnce({
      prediction: 0,
      label: 'No Reassignment Required',
      probability: 0.1,
    });

    const { result } = renderHook(() => usePrediction());

    await act(async () => {
      await result.current.predict(samplePayload);
    });
    expect(result.current.status).toBe('success');

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
