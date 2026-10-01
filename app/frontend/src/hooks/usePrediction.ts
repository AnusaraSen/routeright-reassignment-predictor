import { useState, useCallback } from 'react';
import { mockPredict } from '@/mocks/prediction';
import { PredictionFormData, PredictionResponse } from '@/types/prediction';

export type PredictionStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UsePredictionReturn {
  status: PredictionStatus;
  result: PredictionResponse | null;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  predict: (formData: PredictionFormData) => Promise<PredictionResponse | null>;
  reset: () => void;
  retry: () => Promise<PredictionResponse | null>;
}

export const usePrediction = (): UsePredictionReturn => {
  const [status, setStatus] = useState<PredictionStatus>('idle');
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<PredictionFormData | null>(null);

  const predict = useCallback(async (formData: PredictionFormData): Promise<PredictionResponse | null> => {
    setStatus('loading');
    setError(null);
    setLastPayload(formData);

    try {
      const response = await mockPredict(formData);
      setResult(response);
      setStatus('success');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during prediction.';
      setError(errorMessage);
      setStatus('error');
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
    setLastPayload(null);
  }, []);

  const retry = useCallback(async (): Promise<PredictionResponse | null> => {
    if (!lastPayload) {
      setError('No previous prediction request to retry.');
      setStatus('error');
      return null;
    }
    return predict(lastPayload);
  }, [lastPayload, predict]);

  return {
    status,
    result,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    predict,
    reset,
    retry,
  };
};

export default usePrediction;
