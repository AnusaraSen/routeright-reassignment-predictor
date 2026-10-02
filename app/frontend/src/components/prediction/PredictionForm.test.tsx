import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PredictionForm } from './PredictionForm';

describe('PredictionForm Component', () => {
  it('renders all three visual sections and all 11 required attributes', () => {
    render(<PredictionForm onSubmit={vi.fn()} />);

    // Check 3 Section Headers
    expect(screen.getByText('1. Ticket Origin & Reporter')).toBeInTheDocument();
    expect(screen.getByText('2. Incident Classification & Symptoms')).toBeInTheDocument();
    expect(screen.getByText('3. Severity & Initial Routing')).toBeInTheDocument();

    // Check 11 inputs:
    // 1. Opened At
    expect(screen.getByLabelText(/Opened At/i)).toBeInTheDocument();
    // 2. Opened By
    expect(screen.getByText('Opened By')).toBeInTheDocument();
    // 3. Contact Channel
    expect(screen.getByLabelText(/Contact Channel/i)).toBeInTheDocument();
    // 4. Location
    expect(screen.getByText('Location')).toBeInTheDocument();
    // 5. Category
    expect(screen.getByText('Category')).toBeInTheDocument();
    // 6. Subcategory
    expect(screen.getByText('Subcategory')).toBeInTheDocument();
    // 7. Reported Symptom
    expect(screen.getByText('Reported Symptom')).toBeInTheDocument();
    // 8. Impact
    expect(screen.getByText('Impact')).toBeInTheDocument();
    // 9. Urgency
    expect(screen.getByText('Urgency')).toBeInTheDocument();
    // 10. Priority
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    // 11. Target Support Queue (assignment_group)
    expect(screen.getByText('Target Support Queue')).toBeInTheDocument();
  });

  it('populates fields when "Load Sample Incident" is clicked', async () => {
    const user = userEvent.setup();
    render(<PredictionForm onSubmit={vi.fn()} />);

    const loadSampleBtn = screen.getByRole('button', { name: /Load Sample Incident/i });
    await user.click(loadSampleBtn);

    // Check that sample values have been set
    expect(screen.getByText(/Opened by 17/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Channel/i)).toHaveValue('Phone');
    expect(screen.getByText(/Location 143/i)).toBeInTheDocument();
    expect(screen.getByText(/Network \/ VPN Infrastructure/i)).toBeInTheDocument();
    expect(screen.getByText(/Subcategory 170/i)).toBeInTheDocument();
    expect(screen.getByText(/Symptom 491/i)).toBeInTheDocument();
    expect(screen.getByText(/General Service Desk L1 \(Group 70\)/i)).toBeInTheDocument();
  });

  it('calls onSubmit with form data when submitted with valid inputs', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<PredictionForm onSubmit={handleSubmit} />);

    // Fill form using Load Sample Incident
    const loadSampleBtn = screen.getByRole('button', { name: /Load Sample Incident/i });
    await user.click(loadSampleBtn);

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Evaluate Reassignment Risk/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          opened_by: 'Opened by  17',
          contact_type: 'Phone',
          location: 'Location 143',
          category: 'Category 26',
          subcategory: 'Subcategory 170',
          u_symptom: 'Symptom 491',
          assignment_group: 'Group 70',
        }),
        expect.anything()
      );
    });
  });

  it('disables submit button and prevents duplicate submit when isEvaluating is true', () => {
    render(<PredictionForm onSubmit={vi.fn()} isEvaluating={true} />);

    const submitBtn = screen.getByRole('button', { name: /Evaluate Reassignment Risk/i });
    expect(submitBtn).toBeDisabled();
  });

  it('resets form fields and calls onReset when Reset button is clicked', async () => {
    const user = userEvent.setup();
    const handleReset = vi.fn();

    render(<PredictionForm onSubmit={vi.fn()} onReset={handleReset} />);

    // Load sample incident first
    const loadSampleBtn = screen.getByRole('button', { name: /Load Sample Incident/i });
    await user.click(loadSampleBtn);
    expect(screen.getByLabelText(/Contact Channel/i)).toHaveValue('Phone');

    // Click Reset
    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    await user.click(resetBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText(/Contact Channel/i)).toHaveValue('');
  });
});
