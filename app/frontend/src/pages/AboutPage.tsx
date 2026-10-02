import React from 'react';
import {
  FileEdit,
  Cpu,
  TrendingUp,
  UserCheck,
  ShieldAlert,
  Info,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';

export const AboutPage: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Enter ticket details',
      description:
        'The service-desk agent or triage officer inputs human-readable incident parameters available when the ticket is initially opened (caller, contact method, location, category, symptom, and target resolver queue).',
      icon: FileEdit,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      step: '02',
      title: 'System processes inputs',
      description:
        'The interface validates all field inputs via client-side schemas. Downstream services normalize categorical terms and derive temporal attributes (e.g., submission hour and day of week) without exposing raw internals to the user.',
      icon: Cpu,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      step: '03',
      title: 'Model estimates reassignment risk',
      description:
        'A classification model trained on historical IT incident triage data scores the ticket attributes against known patterns that previously resulted in ticket bounces and reassignment cycles.',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      step: '04',
      title: 'Service-desk user reviews routing',
      description:
        'The triage officer reviews the risk assessment in clear business terminology (Reassignment Required vs No Reassignment Required) and decides whether to confirm or adjust the initial routing.',
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-2">
      {/* Page Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <Info className="w-3.5 h-3.5" />
          System Overview & Methodology
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About RouteRight AI
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          RouteRight AI is a machine-learning-assisted decision-support platform designed to improve
          IT service-management efficiency by predicting ticket reassignment risks at the moment of
          creation.
        </p>
      </div>

      {/* Decision-Support Note Callout */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-5 sm:p-6 flex items-start gap-4 shadow-xs">
        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <h2 className="text-base font-semibold text-amber-900">
            Important Decision-Support Notice
          </h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>
              This tool supports human decisions and does not automatically reassign tickets.
            </strong>{' '}
            All outputs represent statistical estimates aimed at helping service-desk professionals
            spot problematic tickets early. Final dispatch and routing decisions remain under the
            governance of operational staff.
          </p>
        </div>
      </div>

      {/* Four-Step Business Flow */}
      <section aria-labelledby="flow-heading" className="space-y-6">
        <div>
          <h2 id="flow-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
            Four-Step Operational Flow
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            How RouteRight AI integrates seamlessly into existing incident management practices:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.step} className="flex flex-col justify-between">
                <div>
                  <CardHeader className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg border ${item.color} shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Step {item.step}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-2">
                    <CardTitle className="text-base sm:text-lg">{item.title}</CardTitle>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* System Architecture & Operational Governance */}
      <section aria-labelledby="context-heading" className="space-y-4">
        <h2 id="context-heading" className="text-xl font-bold text-slate-900">
          System Architecture & Operational Governance
        </h2>

        <Card variant="muted">
          <CardContent className="space-y-4 p-6 text-sm text-slate-600 leading-relaxed">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Incident Triage Intelligence Architecture</span>
            </div>
            <p>
              This application forms the frontend evaluation layer for an enterprise IT incident
              routing pipeline. Key design constraints respected by the interface include:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Data Leakage Prevention:</strong> Only initial ticket creation attributes
                  are collected. Fields that represent post-creation states (such as reassignment
                  count, resolution time, or close codes) are strictly prohibited from user inputs.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Separation of Concerns:</strong> React components maintain clean,
                  human-readable input values and validation without attempting to recreate machine
                  learning preprocessing or feature encoding logic inside the client.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AboutPage;
