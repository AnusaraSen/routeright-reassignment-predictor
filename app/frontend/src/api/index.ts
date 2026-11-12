import type { PredictionFormData, PredictionResponse } from '../types/prediction';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';
const FALLBACK_API_BASE_URL = 'http://localhost:8000';

async function fetchWithFallback(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_BASE_URL}${path}`, init);
  } catch (err) {
    if (!import.meta.env.VITE_API_BASE_URL) {
      return await fetch(`${FALLBACK_API_BASE_URL}${path}`, init);
    }
    throw err;
  }
}

export async function predictIncident(payload: PredictionFormData): Promise<PredictionResponse> {
  const response = await fetchWithFallback('/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Prediction request failed';

    try {
      const errorData = await response.json();

      if (errorData.detail) {
        message =
          typeof errorData.detail === 'string'
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      }
    } catch {
      // Keep default error message.
    }

    throw new Error(message);
  }

  const data: PredictionResponse = await response.json();

  return data;
}

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetchWithFallback('/health');

    return response.ok;
  } catch {
    return false;
  }
}
