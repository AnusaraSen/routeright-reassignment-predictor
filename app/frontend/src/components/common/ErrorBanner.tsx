import React from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';
import { Button } from './Button';

export interface ErrorBannerProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  title = 'Prediction Request Failed',
  onRetry,
  onDismiss,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`rounded-2xl bg-rose-50/90 border border-rose-200/90 p-4 sm:p-5 shadow-xs transition-all animate-in fade-in-0 duration-200 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className="h-9 w-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-rose-500/25">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-rose-950">
              {title}
            </h4>
            <p className="text-xs sm:text-sm text-rose-700 leading-relaxed font-normal">
              {message}
            </p>
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            aria-label="Dismiss error notification"
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {onRetry && (
        <div className="mt-3.5 pt-3 border-t border-rose-200/70 flex items-center justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-rose-600" />}
            className="text-xs font-bold text-rose-700 bg-white hover:bg-rose-100 border-rose-300 hover:border-rose-400"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorBanner;
