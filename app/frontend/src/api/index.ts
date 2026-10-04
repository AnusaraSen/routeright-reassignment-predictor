import type { PredictionFormData, PredictionResponse } from '../types/prediction';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function predictIncident(payload: PredictionFormData): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
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
    const response = await fetch(`${API_BASE_URL}/health`);

    return response.ok;
  } catch {
    return false;
  }
}
