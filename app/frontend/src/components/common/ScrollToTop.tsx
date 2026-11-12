import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 *
 * Automatically scrolls window and document to the top (0, 0) whenever the
 * route pathname changes in React Router SPA navigation.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable native browser automatic scroll restoration to avoid conflicting with SPA routing
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (typeof window.scrollTo === 'function') {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
          });
        }
      } catch {
        // Fallback for environments where window.scrollTo throws (e.g., standard jsdom)
      }
    }

    if (typeof document !== 'undefined') {
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
