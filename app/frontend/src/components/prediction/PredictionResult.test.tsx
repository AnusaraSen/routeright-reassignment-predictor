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
    risk_level: 'high',
    decision_threshold: 0.5,
    model_name: 'Random Forest',
    status: 'success',
    inference_time_ms: 38,
    predicted_department: 'Group 70',
    recommended_departments: [
      { department: 'Group 70', probability: 0.512, rank: 1 },
      { department: 'Group 39', probability: 0.245, rank: 2 },
      { department: 'Group 25', probability: 0.143, rank: 3 },
    ],
  };

  const negativeResult: PredictionResponse = {
    prediction: 0,
    label: 'No Reassignment Required',
    probability: 0.14,
    risk_level: 'low',
    decision_threshold: 0.5,
    model_name: 'Random Forest',
    status: 'success',
    inference_time_ms: 42,
    predicted_department: 'Group 24',
    recommended_departments: [
      { department: 'Group 24', probability: 0.42, rank: 1 },
      { department: 'Group 70', probability: 0.31, rank: 2 },
    ],
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

    // Probability and model metadata
    expect(screen.getByText('84.0%')).toBeInTheDocument();
    expect(screen.getByText('high Risk')).toBeInTheDocument();
    expect(screen.getByText('Random Forest · API status: success')).toBeInTheDocument();
  });

  it('renders Stage-2 recommended target departments and probabilities', () => {
    render(<PredictionResult result={positiveResult} />);

    expect(
      screen.getByTestId('department-recommendations-section')
    ).toBeInTheDocument();
    expect(screen.getAllByText('Group 70').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Group 39')).toBeInTheDocument();
    expect(screen.getByText('Group 25')).toBeInTheDocument();
    expect(screen.getByText('51.2%')).toBeInTheDocument();
    expect(screen.getByText('24.5%')).toBeInTheDocument();
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
    expect(screen.getByText('14.0%')).toBeInTheDocument();
  });

  it('renders the non-overclaiming decision-support notice', () => {
    render(<PredictionResult result={positiveResult} />);

    expect(
      screen.getByText(/The result is a prediction for decision support, not a guarantee/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Do not label users or teams as incorrect/i)).toBeInTheDocument();
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
