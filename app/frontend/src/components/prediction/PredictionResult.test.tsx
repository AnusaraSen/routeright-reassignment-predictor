import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PredictionResult } from './PredictionResult';
import { PredictionResponse } from '@/types/prediction';

describe('PredictionResult Component', () => {
  const positiveResult: PredictionResponse = {
    prediction: 1,
    label: 'Reassignment Required',
    probability: 0.84,
    confidence: 0.88,
    diagnosis: 'Historical triage logs indicate potential bounce.',
    recommendation: 'Route directly to Network Operations L2.',
    estimated_savings: 'Saves ~4.5 Hours MTTR.',
    inference_time_ms: 38,
  };

  const negativeResult: PredictionResponse = {
    prediction: 0,
    label: 'No Reassignment Required',
    probability: 0.14,
    confidence: 0.92,
    diagnosis: 'Specialist domain matches the reported symptom profile.',
    recommendation: 'Confirm current routing to target specialist team.',
    inference_time_ms: 42,
  };

  it('renders positive outcome (prediction = 1) with exact required primary and supporting texts', () => {
    render(<PredictionResult result={positiveResult} />);

    // Primary text
    const primaryHeadings = screen.getAllByText('Reassignment Required');
    expect(primaryHeadings.length).toBeGreaterThanOrEqual(1);

    // Mandated supporting guidance
    expect(
      screen.getByText('Review the initial routing before the incident proceeds further.')
    ).toBeInTheDocument();

    // Probability & Confidence
    expect(screen.getByText('84%')).toBeInTheDocument();
    expect(screen.getByText('88%')).toBeInTheDocument();

    // Diagnosis & Recommendation
    expect(
      screen.getByText('Historical triage logs indicate potential bounce.')
    ).toBeInTheDocument();
    expect(screen.getByText('Route directly to Network Operations L2.')).toBeInTheDocument();
    expect(screen.getByText('Saves ~4.5 Hours MTTR.')).toBeInTheDocument();
  });

  it('renders negative outcome (prediction = 0) with exact required primary and supporting texts', () => {
    render(<PredictionResult result={negativeResult} />);

    // Primary text
    const primaryHeadings = screen.getAllByText('No Reassignment Required');
    expect(primaryHeadings.length).toBeGreaterThanOrEqual(1);

    // Mandated supporting guidance
    expect(
      screen.getByText(
        'The current routing is predicted to remain appropriate based on the submitted details.'
      )
    ).toBeInTheDocument();

    // Probability
    expect(screen.getByText('14%')).toBeInTheDocument();
  });

  it('renders the non-overclaiming decision-support notice', () => {
    render(<PredictionResult result={positiveResult} />);

    expect(
      screen.getByText(/The result is a prediction for decision support, not a guarantee/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Do not label users or teams as incorrect/i)).toBeInTheDocument();
  });

  it('does NOT render the probability section when probability is undefined', () => {
    const resultWithoutProb: PredictionResponse = {
      prediction: 1,
      label: 'Reassignment Required',
      probability: undefined as unknown as number,
      diagnosis: 'Diagnostic note without numeric probability.',
    };

    render(<PredictionResult result={resultWithoutProb} />);

    expect(screen.queryByTestId('probability-section')).not.toBeInTheDocument();
    expect(screen.queryByText(/Reassignment Probability/i)).not.toBeInTheDocument();
  });

  it('calls onStartNew callback when "Start New Prediction" button is clicked', async () => {
    const user = userEvent.setup();
    const handleStartNew = vi.fn();

    render(<PredictionResult result={positiveResult} onStartNew={handleStartNew} />);

    const startNewBtn = screen.getByRole('button', { name: /Start New Prediction/i });
    expect(startNewBtn).toBeInTheDocument();

    await user.click(startNewBtn);
    expect(handleStartNew).toHaveBeenCalledTimes(1);
  });
});
