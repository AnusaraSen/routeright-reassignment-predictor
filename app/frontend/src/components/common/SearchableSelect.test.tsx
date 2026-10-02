import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SearchableSelect } from './SearchableSelect';

describe('SearchableSelect Component', () => {
  const mockOptions = [
    { value: 'opt1', label: 'Option One (Alpha)' },
    { value: 'opt2', label: 'Option Two (Beta)' },
    { value: 'opt3', label: 'Option Three (Gamma)' },
  ];

  it('renders label, placeholder, and required indicator', () => {
    render(
      <SearchableSelect
        label="Test Category"
        required
        value=""
        onChange={vi.fn()}
        options={mockOptions}
        placeholder="Choose Category..."
      />
    );

    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Choose Category...')).toBeInTheDocument();
  });

  it('opens options dropdown list on button click', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelect
        label="Test Select"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
      />
    );

    const trigger = screen.getByRole('button', { name: /Test Select/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Option One (Alpha)')).toBeInTheDocument();
    expect(screen.getByText('Option Two (Beta)')).toBeInTheDocument();
  });

  it('filters options based on search query', async () => {
    const user = userEvent.setup();
    render(
      <SearchableSelect
        label="Searchable"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
      />
    );

    const trigger = screen.getByRole('button', { name: /Searchable/i });
    await user.click(trigger);

    const searchInput = screen.getByPlaceholderText('Search options...');
    await user.type(searchInput, 'Gamma');

    expect(screen.getByText('Option Three (Gamma)')).toBeInTheDocument();
    expect(screen.queryByText('Option One (Alpha)')).not.toBeInTheDocument();
    expect(screen.queryByText('Option Two (Beta)')).not.toBeInTheDocument();
  });

  it('selects option on click and calls onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <SearchableSelect
        label="Select Test"
        value=""
        onChange={handleChange}
        options={mockOptions}
      />
    );

    const trigger = screen.getByRole('button', { name: /Select Test/i });
    await user.click(trigger);

    const option2 = screen.getByText('Option Two (Beta)');
    await user.click(option2);

    expect(handleChange).toHaveBeenCalledWith('opt2');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clears selection when clear button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <SearchableSelect
        label="Select Test"
        value="opt1"
        onChange={handleChange}
        options={mockOptions}
      />
    );

    expect(screen.getByText('Option One (Alpha)')).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: /clear selection/i });
    await user.click(clearBtn);

    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('navigates options via keyboard arrows and selects with Enter', () => {
    const handleChange = vi.fn();

    render(
      <SearchableSelect
        label="Keyboard Test"
        value=""
        onChange={handleChange}
        options={mockOptions}
      />
    );

    const trigger = screen.getByRole('button', { name: /Keyboard Test/i });
    // Open on ArrowDown
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search options...');
    // Arrow down to highlight item index 1 (Option Two)
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalledWith('opt2');
  });

  it('closes dropdown on Escape key', () => {
    render(
      <SearchableSelect
        label="Escape Test"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
      />
    );

    const trigger = screen.getByRole('button', { name: /Escape Test/i });
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search options...');
    fireEvent.keyDown(searchInput, { key: 'Escape' });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders field error message if provided', () => {
    render(
      <SearchableSelect
        label="Error Test"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
        error="This field is strictly required"
      />
    );

    expect(screen.getByText('This field is strictly required')).toBeInTheDocument();
  });
});
