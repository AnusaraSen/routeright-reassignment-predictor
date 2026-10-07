import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ScrollToTop } from './ScrollToTop';

describe('ScrollToTop Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls window.scrollTo with top: 0 and left: 0 on initial render and route change', () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  });

  it('resets document.documentElement.scrollTop and document.body.scrollTop', () => {
    document.documentElement.scrollTop = 500;
    document.body.scrollTop = 500;

    render(
      <MemoryRouter initialEntries={['/predict']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(document.documentElement.scrollTop).toBe(0);
    expect(document.body.scrollTop).toBe(0);
  });
});
