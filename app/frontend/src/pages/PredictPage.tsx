import React from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flame,
  HelpCircle,
  Layers,
  MapPin,
  Network,
  PhoneCall,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tag,
  UserCheck,
} from 'lucide-react';

export const PredictPage: React.FC = () => {
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
          future reassignment. All evaluations operate strictly on pre-assignment data to support
          first-contact routing accuracy.
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

      {/* Two-Column Layout for Form and Prediction Result Shells */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Region Shell (Tasks 3-4 will integrate the 11-field form here) */}
        <section
          aria-labelledby="ticket-form-heading"
          className="lg:col-span-7 xl:col-span-8 space-y-6"
        >
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                  <SlidersHorizontal className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h2
                    id="ticket-form-heading"
                    className="text-xl font-bold text-slate-900 tracking-tight"
                  >
                    Ticket Parameters
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Provide initial details available at incident creation
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                11 Attributes
              </span>
            </div>

            {/* Structured 3-Part Pre-Triage Feature Groups */}
            <div className="space-y-6">
              {/* Group 1: Ticket Origin */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    1. Ticket Origin
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    3 Pre-Triage Fields
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <UserCheck className="w-3 h-3 text-slate-400" />
                      <span>Opened By</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700">Staff ID (e.g. 17)</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <PhoneCall className="w-3 h-3 text-slate-400" />
                      <span>Contact Type</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700">Phone / Email / Self</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>Location</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700">Office / Site Code</div>
                  </div>
                </div>
              </div>

              {/* Group 2: Incident Classification */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-600" />
                    2. Incident Classification
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">3 Category Fields</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>Category</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700">Hardware / Network</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Network className="w-3 h-3 text-slate-400" />
                      <span>Subcategory</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700">System Component</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <AlertTriangle className="w-3 h-3 text-slate-400" />
                      <span>Reported Symptom</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700">Symptom Diagnostic</div>
                  </div>
                </div>
              </div>

              {/* Group 3: Severity & Routing */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    3. Severity & Initial Routing
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    4 Routing Parameters
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Flame className="w-3 h-3 text-slate-400" />
                      <span>Impact</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700">1 - High to 3 - Low</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Urgency</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700">1 - High to 3 - Low</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Activity className="w-3 h-3 text-slate-400" />
                      <span>Priority</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700">ITSM Matrix</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Layers className="w-3 h-3 text-slate-400" />
                      <span>Initial Group</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700">Target Queue</div>
                  </div>
                </div>
              </div>

              {/* Task 4 Hook Status Bar */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold">
                    Parameters and schemas ready for live form binding in Task 4
                  </span>
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200 shrink-0 shadow-2xs">
                  React Hook Form + Zod
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Result Region Shell (Task 5 will integrate the result card here) */}
        <section
          aria-labelledby="prediction-result-heading"
          className="lg:col-span-5 xl:col-span-4 space-y-6"
        >
          {/* Telemetry Result Console Card */}
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
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                &lt; 50ms Inference
              </span>
            </div>

            {/* Awaiting State Visual */}
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
              <span className="text-slate-400">IT3051 Model Specs</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PredictPage;
