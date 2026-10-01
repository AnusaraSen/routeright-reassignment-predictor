import React from 'react';
import { AlertCircle, HelpCircle, Layers, SlidersHorizontal } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/common/Card';

export const PredictPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Incident Reassignment Risk Prediction
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl">
          Enter initial ticket attributes known at ticket creation to evaluate the probability of
          future reassignment. All evaluations operate on pre-assignment data to support
          first-contact routing accuracy.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-blue-900">
          <span className="font-semibold">Decision-Support Guideline:</span> This prediction tool
          assists service-desk triage officers in recognizing risk patterns. It does not
          automatically reassign tickets or bypass team routing policies.
        </div>
      </div>

      {/* Two-Column Layout for Form and Prediction Result Shells */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Region Shell (Tasks 3-4 will integrate the 11-field form here) */}
        <section
          aria-labelledby="ticket-form-heading"
          className="lg:col-span-7 xl:col-span-8 space-y-6"
        >
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle id="ticket-form-heading">Ticket Parameters</CardTitle>
                <CardDescription>
                  Provide initial details available at incident creation
                </CardDescription>
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">
                11 Attributes
              </span>
            </CardHeader>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-800">
                    Prediction Form Placeholder
                  </h3>
                  <p className="text-sm text-slate-500">
                    Form fields for Ticket Origin, Classification, and Severity & Routing will be
                    connected in Task 4.
                  </p>
                </div>
                <div className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
                  Ready for React Hook Form + Zod integration
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Result Region Shell (Task 5 will integrate the result card here) */}
        <section
          aria-labelledby="prediction-result-heading"
          className="lg:col-span-5 xl:col-span-4 space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle id="prediction-result-heading">Assessment Result</CardTitle>
              <CardDescription>Predicted reassignment outcome</CardDescription>
            </CardHeader>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-3 bg-slate-100 text-slate-500 rounded-xl border border-slate-200">
                  <Layers className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-medium text-slate-700">Awaiting Submission</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-xs">
                    Complete the ticket parameters form and submit to receive an immediate risk
                    assessment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Guidance Box */}
          <Card variant="muted">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>Feature Expectations</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inputs collect standard human-readable values. Derivations (e.g. day of week, hour)
                and categorical encodings are resolved downstream outside the UI presentation.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default PredictPage;
