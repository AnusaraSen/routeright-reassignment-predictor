import React from 'react';
import {
  Activity,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { PredictionForm } from '@/components/prediction/PredictionForm';
import { PredictionResult } from '@/components/prediction/PredictionResult';
import { PredictionSkeleton } from '@/components/prediction/PredictionSkeleton';
import { usePrediction } from '@/hooks/usePrediction';
import { PredictionFormSchemaType } from '@/schemas/prediction.schema';

export const PredictPage: React.FC = () => {
  const { status, result, error, isLoading, predict, reset, retry } = usePrediction();

  const handleFormSubmit = async (data: PredictionFormSchemaType) => {
    await predict(data);
  };

  const handleResetForm = () => {
    reset();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          Triage Intelligence Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Incident Reassignment Risk Prediction
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed font-normal">
          Enter initial ticket attributes known at ticket creation to evaluate the probability of
          future reassignment. All evaluations operate strictly on initial ticket creation
          attributes to support first-contact routing accuracy.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white border border-blue-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-500/25">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Decision-Support Guideline:</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200/70">
                Operator Governed
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
              This prediction tool assists service-desk triage officers in recognizing risk
              patterns. It does not automatically reassign tickets or bypass team routing policies.
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Zero Data Leakage Guardrail</span>
        </div>
      </div>

      {/* Error Alert Banner if Prediction Request Failed */}
      {error && (
        <ErrorBanner
          message={error}
          onRetry={retry}
          onDismiss={reset}
        />
      )}

      {/* Two-Column Layout for Form and Prediction Result Shells */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Modular Prediction Form */}
        <section
          aria-labelledby="ticket-form-heading"
          className="lg:col-span-7 xl:col-span-8 space-y-6"
        >
          <PredictionForm
            onSubmit={handleFormSubmit}
            isEvaluating={isLoading}
            onReset={handleResetForm}
          />
        </section>

        {/* Right Column: Dynamic Assessment Result Shell */}
        <section
          aria-labelledby="prediction-result-heading"
          className="lg:col-span-5 xl:col-span-4 space-y-6"
        >
          {/* Dynamic State: Loading Skeleton vs Result vs Awaiting Submission */}
          {isLoading ? (
            <PredictionSkeleton />
          ) : status === 'success' && result ? (
            <PredictionResult
              result={result}
              onStartNew={handleResetForm}
            />
          ) : (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl text-white space-y-6">
              {/* Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <span
                    id="prediction-result-heading"
                    className="text-sm font-bold text-white ml-2 tracking-wide"
                  >
                    Assessment Result
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Ready for Input
                </span>
              </div>

              {/* Awaiting Submission Graphic & Guidance */}
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shadow-inner">
                    <Activity className="w-8 h-8 text-blue-400 animate-pulse" />
                  </div>
                  <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl blur-xs -z-10"></div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white">Awaiting Submission</h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Complete the ticket parameters form and submit to receive an immediate risk
                    assessment.
                  </p>
                </div>

                {/* Metric Placeholders */}
                <div className="w-full grid grid-cols-2 gap-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-left space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Reassignment Risk
                    </span>
                    <div className="text-lg font-mono font-bold text-slate-500">-- %</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-left space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Routing Verdict
                    </span>
                    <div className="text-xs font-bold text-slate-500 pt-1">Pending Input</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feature Expectations & Guardrails */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Feature Expectations</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Inputs collect standard human-readable values. Derivations (e.g. day of week, hour)
              and categorical encodings are resolved downstream outside the UI presentation.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Zero Leakage Guaranteed
              </span>
              <span className="text-slate-400">Operational Model Specs</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PredictPage;
