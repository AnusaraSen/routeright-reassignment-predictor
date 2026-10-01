import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const isMockMode = import.meta.env.VITE_USE_MOCK_API === 'true';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">RouteRight AI</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Phase 1 Ready
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                isMockMode
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isMockMode ? 'Mock API Active' : 'Live API Mode'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-4 h-4" />
          IT Incident Reassignment Risk Prediction
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-2xl">
          Early Decision-Support for Incident Triage
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl">
          RouteRight AI evaluates IT incident parameters at creation to forecast reassignment risk,
          empowering service-desk teams to route tickets accurately the first time.
        </p>

        {/* Task 1 Readiness Card */}
        <div className="mt-8 w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-left">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-slate-900">
              Task 1: Bootstrap & Tooling Active
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>React 18 + Vite + TypeScript Strict Configured</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Tailwind CSS utility & design system integrated</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>React Router, React Hook Form, Zod & Axios installed</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Vitest, Testing Library, ESLint & Prettier ready</span>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Ready for Task 2: Application Shell & Routes</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>IT3051 Fundamentals of Data Mining &bull; RouteRight AI Decision Support Interface</p>
      </footer>
    </div>
  );
};

export default App;
