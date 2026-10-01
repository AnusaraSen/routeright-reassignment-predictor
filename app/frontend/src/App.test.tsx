import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders RouteRight AI brand heading', () => {
    render(<App />);
    expect(screen.getByText('RouteRight AI')).toBeInTheDocument();
    expect(screen.getByText('Early Decision-Support for Incident Triage')).toBeInTheDocument();
  });
});
