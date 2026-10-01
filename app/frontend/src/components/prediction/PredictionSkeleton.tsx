import React from 'react';
import { Activity } from 'lucide-react';

export interface PredictionSkeletonProps {
  className?: string;
}

export const PredictionSkeleton: React.FC<PredictionSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={`rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl text-white space-y-6 animate-pulse ${className}`}
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
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-500/30">
          <Activity className="w-3.5 h-3.5 animate-spin text-blue-400" />
          Inference in progress...
        </span>
      </div>

      {/* Outcome Badge Skeleton */}
      <div className="flex items-center justify-between pt-1">
        <div className="h-4 w-28 bg-slate-800 rounded-md"></div>
        <div className="h-7 w-44 bg-slate-800 rounded-full"></div>
      </div>

      {/* Probability Gauge Skeleton */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-baseline justify-between">
          <div className="h-4 w-40 bg-slate-800 rounded-md"></div>
          <div className="h-8 w-16 bg-slate-800 rounded-md"></div>
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden">
          <div className="h-3 w-2/3 bg-blue-600/40 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Diagnosis Box Skeleton */}
      <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-2">
        <div className="h-3.5 w-32 bg-slate-700/60 rounded"></div>
        <div className="h-3 w-full bg-slate-700/40 rounded"></div>
        <div className="h-3 w-4/5 bg-slate-700/40 rounded"></div>
      </div>

      {/* Recommendation Box Skeleton */}
      <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800/80 space-y-2">
        <div className="h-3.5 w-36 bg-slate-700/60 rounded"></div>
        <div className="h-3.5 w-3/4 bg-slate-700/50 rounded"></div>
        <div className="h-3 w-1/2 bg-slate-700/30 rounded"></div>
      </div>

      <div className="text-center pt-1 text-xs text-slate-400 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
        Evaluating creation attributes against historical dispatch models...
      </div>
    </div>
  );
};

export default PredictionSkeleton;
