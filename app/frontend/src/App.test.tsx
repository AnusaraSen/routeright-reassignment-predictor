import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';

describe('RouteRight AI Application Routing & Shell', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders the Home page by default with hero, branding, and benefit cards', () => {
    render(<App />);

    // Header & Footer branding elements
    const brandingElements = screen.getAllByText('RouteRight AI');
    expect(brandingElements.length).toBeGreaterThanOrEqual(1);

    // Hero title
    expect(
      screen.getByRole('heading', {
        name: /Prevent Incident Reassignments Before Delays Accumulate/i,
      })
    ).toBeInTheDocument();

    // Primary CTA
    const ctaButton = screen.getByRole('button', { name: /Predict Reassignment Risk/i });
    expect(ctaButton).toBeInTheDocument();

    // Three benefit cards
    expect(screen.getByText('Reduce MTTR & Multi-Hops')).toBeInTheDocument();
    expect(screen.getByText('Data-Driven Triage')).toBeInTheDocument();
    expect(screen.getByText('Human-in-the-Loop')).toBeInTheDocument();
  });

  it('navigates to Predict page when primary CTA is clicked', () => {
    render(<App />);

    const ctaButton = screen.getByRole('button', { name: /Predict Reassignment Risk/i });
    fireEvent.click(ctaButton);

    // Predict page header is rendered
    expect(screen.getByText('Incident Reassignment Risk Prediction')).toBeInTheDocument();
    expect(screen.getByText('Ticket Parameters')).toBeInTheDocument();
    expect(screen.getByText('Assessment Result')).toBeInTheDocument();
  });

  it('renders About page with 4-step flow and decision support disclaimer', () => {
    window.history.pushState({}, '', '/about');
    render(<App />);

    expect(screen.getByText('About RouteRight AI')).toBeInTheDocument();
    expect(screen.getByText('Important Decision-Support Notice')).toBeInTheDocument();
    expect(
      screen.getByText(
        /This tool supports human decisions and does not automatically reassign tickets/i
      )
    ).toBeInTheDocument();

    // 4 Steps
    expect(screen.getByText('Enter ticket details')).toBeInTheDocument();
    expect(screen.getByText('System processes inputs')).toBeInTheDocument();
    expect(screen.getByText('Model estimates reassignment risk')).toBeInTheDocument();
    expect(screen.getByText('Service-desk user reviews routing')).toBeInTheDocument();
  });

  it('renders 404 NotFound page for invalid route', () => {
    window.history.pushState({}, '', '/some-non-existent-page');
    render(<App />);

    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Return Home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go to Predict/i })).toBeInTheDocument();
  });
});
