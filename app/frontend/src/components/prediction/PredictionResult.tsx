import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Info,
  RotateCcw,
  ShieldCheck,
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
  const primaryOutcomeText = isReassignmentRequired
    ? 'Reassignment Required'
    : 'No Reassignment Required';

  const supportingGuidanceText = isReassignmentRequired
    ? 'Review the initial routing before the incident proceeds further.'
    : 'The current routing is predicted to remain appropriate based on the submitted details.';

  const probabilityPercent = result.probability * 100;
  const recommendations = result.recommended_departments ?? [];
  const topDepartment =
    result.predicted_department || (recommendations.length > 0 ? recommendations[0].department : null);

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
          {result.inference_time_ms}ms Inference
        </span>
      </div>

      {/* Stage 1: Outcome Verdict Card */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className={`p-4 sm:p-5 rounded-2xl border transition-all break-words ${
          isReassignmentRequired
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
            Stage 1 · Model Verdict
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
          {result.label}
        </h3>

        {/* Mandated Supporting Guidance */}
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed font-normal">
          {supportingGuidanceText}
        </p>
      </div>

      {/* Stage 1: Reassignment Rate / Probability Section */}
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
            {probabilityPercent.toFixed(1)}%
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

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Risk Level</span>
          <span className="font-semibold text-slate-300 capitalize">
            {result.risk_level} Risk
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Decision Threshold</span>
          <span className="font-semibold text-slate-300">
            {(result.decision_threshold * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Stage 2: Recommended Target Department(s) After Reassignment */}
      {(topDepartment || recommendations.length > 0) && (
        <div
          data-testid="department-recommendations-section"
          className={`p-4 rounded-2xl border space-y-3 ${
            isReassignmentRequired
              ? 'bg-indigo-950/35 border-indigo-500/40'
              : 'bg-slate-800/70 border-slate-700/80'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              {isReassignmentRequired
                ? 'Stage 2 · Recommended Target Department'
                : 'Stage 2 · Alternative Department Candidates'}
            </span>
            {topDepartment && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-400/40">
                <ArrowRight className="w-3 h-3 text-indigo-300" />
                {topDepartment}
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            {isReassignmentRequired
              ? 'If reassigned, historical lifecycle routing patterns indicate the ticket is most likely to be resolved by:'
              : 'Current assignment is low-risk. If escalated or transferred later, top candidate resolver groups are:'}
          </p>

          {recommendations.length > 0 && (
            <div className="space-y-2 pt-1">
              {recommendations.map((rec) => {
                const deptPct = rec.probability * 100;
                const isTopRank = rec.rank === 1;
                return (
                  <div
                    key={rec.department}
                    className={`p-2.5 rounded-xl border ${
                      isTopRank
                        ? 'bg-slate-900/90 border-indigo-500/40'
                        : 'bg-slate-900/50 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-100 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-extrabold ${
                            isTopRank
                              ? 'bg-indigo-500 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {rec.rank}
                        </span>
                        {rec.department}
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          isTopRank ? 'text-indigo-300' : 'text-slate-400'
                        }`}
                      >
                        {deptPct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          isTopRank
                            ? 'bg-gradient-to-r from-indigo-400 to-blue-500'
                            : 'bg-slate-600'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(4, deptPct))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          Model Details
        </span>
        <p className="text-xs text-slate-200 leading-relaxed font-normal">
          {result.model_name} · API status: {result.status}
        </p>
      </div>

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
