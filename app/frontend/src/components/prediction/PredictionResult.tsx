import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  RotateCcw,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { PredictionResponse } from '@/types/prediction';

export interface PredictionResultProps {
  result: PredictionResponse;
  onStartNew?: () => void;
  className?: string;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({
  result,
  onStartNew,
  className = '',
}) => {
  const isReassignmentRequired = result.prediction === 1;
  const hasProbability = typeof result.probability === 'number' && !Number.isNaN(result.probability);

  // Exact required wording per specifications
  const primaryOutcomeText = isReassignmentRequired
    ? 'Reassignment Required'
    : 'No Reassignment Required';

  const supportingGuidanceText = isReassignmentRequired
    ? 'Review the initial routing before the incident proceeds further.'
    : 'The current routing is predicted to remain appropriate based on the submitted details.';

  const probabilityPercent = hasProbability ? Math.round(result.probability * 100) : 0;

  return (
    <div
      className={`rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl text-white space-y-6 transition-all duration-300 animate-in fade-in-0 duration-300 ${className}`}
    >
      {/* Console Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          <span className="text-sm font-bold text-white ml-2 tracking-wide">
            Assessment Result
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          {result.inference_time_ms ? `${result.inference_time_ms}ms Inference` : '< 50ms Inference'}
        </span>
      </div>

      {/* Outcome Verdict Card */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          isReassignmentRequired
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
            Model Verdict
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${
              isReassignmentRequired
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isReassignmentRequired ? (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            {primaryOutcomeText}
          </span>
        </div>

        <h3
          className={`text-lg sm:text-xl font-extrabold tracking-tight ${
            isReassignmentRequired ? 'text-rose-100' : 'text-emerald-100'
          }`}
        >
          {primaryOutcomeText}
        </h3>

        {/* Mandated Supporting Guidance */}
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed font-normal">
          {supportingGuidanceText}
        </p>
      </div>

      {/* Optional Probability Display - Only rendered when probability exists */}
      {hasProbability && (
        <div className="space-y-2 pt-1" data-testid="probability-section">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-300 font-medium">
              Reassignment Probability
            </span>
            <span
              className={`text-3xl font-black ${
                isReassignmentRequired ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {probabilityPercent}%
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              role="progressbar"
              aria-valuenow={probabilityPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              className={`h-2.5 rounded-full transition-all duration-700 ${
                isReassignmentRequired
                  ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                  : 'bg-gradient-to-r from-teal-400 to-emerald-500'
              }`}
              style={{ width: `${probabilityPercent}%` }}
            />
          </div>

          {result.confidence && (
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Model Confidence</span>
              <span className="font-semibold text-slate-300">
                {Math.round(result.confidence * 100)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Pattern Diagnosis */}
      {result.diagnosis && (
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            Pattern Diagnosis
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-normal">
            {result.diagnosis}
          </p>
        </div>
      )}

      {/* Advisory Recommendation */}
      {result.recommendation && (
        <div
          className={`p-4 rounded-2xl border space-y-1.5 ${
            isReassignmentRequired
              ? 'bg-blue-950/60 border-blue-500/30'
              : 'bg-emerald-950/60 border-emerald-500/30'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Advisory Recommendation</span>
          </div>
          <div className="text-xs font-bold text-white">
            {result.recommendation}
          </div>
          {result.estimated_savings && (
            <div className="text-[11px] text-slate-300 flex items-center gap-1.5 pt-0.5">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{result.estimated_savings}</span>
            </div>
          )}
        </div>
      )}

      {/* Avoid Overclaiming - Decision Support Guardrail */}
      <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed">
          <span className="font-semibold text-slate-300">Decision-Support Notice: </span>
          The result is a prediction for decision support, not a guarantee and not an automatic
          routing action. Do not label users or teams as incorrect.
        </p>
      </div>

      {/* Action Toolbar: Start New Prediction */}
      {onStartNew && (
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onStartNew}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
            className="text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border-slate-700 hover:border-slate-600 px-4 py-2"
          >
            Start New Prediction
          </Button>
        </div>
      )}
    </div>
  );
};

export default PredictionResult;
