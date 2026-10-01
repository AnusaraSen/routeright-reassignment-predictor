import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  GitMerge,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  TrendingDown,
  Layers,
  HelpCircle,
  Sparkles,
  Network,
  Users,
  MapPin,
  Tag,
  Flame,
  UserCheck,
  GitCompare,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/common/Button';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-20 py-4">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-4 pb-2">
        {/* Subtle Ambient Glow */}
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* System Intelligence Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>AI-Powered Incident Triage Intelligence</span>
        </div>

        {/* Headline */}
        <h1
          aria-label="Prevent Incident Reassignments Before Delays Accumulate"
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]"
        >
          Prevent Incident Reassignments <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Before Delays Accumulate
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
          RouteRight AI evaluates IT incident details at ticket creation time to predict the
          likelihood of subsequent reassignment. Service-desk teams can verify initial routing
          decisions early, avoiding unnecessary triage hops.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link to="/predict" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="gradient"
              fullWidth
              rightIcon={<ArrowRight className="w-4.5 h-4.5" />}
              className="px-7 py-3 shadow-md shadow-indigo-500/20"
            >
              Predict Reassignment Risk
            </Button>
          </Link>
          <Link to="/about" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              fullWidth
              leftIcon={<HelpCircle className="w-4.5 h-4.5 text-slate-500" />}
              className="px-7 py-3"
            >
              How It Works
            </Button>
          </Link>
        </div>
      </section>

      {/* High-Contrast Live Triage Preview Card (Dark Console Style to distinctly pop against light background) */}
      <section aria-label="Incident Triage Preview" className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl border border-slate-700/80 bg-slate-900 p-5 sm:p-7 shadow-2xl shadow-slate-900/40 text-white transition-all">
          {/* Top Window Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="h-3.5 w-px bg-slate-700 ml-1"></div>
              <span className="text-xs sm:text-sm font-mono font-bold text-white tracking-wide">
                INC-2026-08492
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                &bull; Opened Today at 09:42 AM
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Priority: 2 - High
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Reassignment Likely (High Risk)
              </span>
            </div>
          </div>

          {/* Card Body - High-Contrast Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
            {/* Left Column: 6 Captured Creation Attributes */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Initial Ticket Parameters (Captured at Creation)
                </div>
                <span className="text-[11px] font-semibold text-blue-300 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                  Pre-Triage Attributes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Tile 1 */}
                <div className="p-3 rounded-xl bg-slate-800/85 border border-slate-700/70 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Tag className="w-3.5 h-3.5 text-blue-400" />
                    <span>Incident Category</span>
                  </div>
                  <div className="font-bold text-white text-xs sm:text-sm">
                    Network / VPN Gateway
                  </div>
                </div>

                {/* Tile 2 */}
                <div className="p-3 rounded-xl bg-slate-800/85 border border-slate-700/70 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Initial Assignment</span>
                  </div>
                  <div className="font-bold text-white text-xs sm:text-sm">
                    General Service Desk L1
                  </div>
                </div>

                {/* Tile 3 */}
                <div className="p-3 rounded-xl bg-slate-800/85 border border-slate-700/70 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reported Symptom</span>
                  </div>
                  <div className="font-bold text-white text-xs sm:text-sm">Global Auth Timeout</div>
                </div>

                {/* Tile 4 */}
                <div className="p-3 rounded-xl bg-slate-800/85 border border-slate-700/70 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Channel & Location</span>
                  </div>
                  <div className="font-bold text-white text-xs sm:text-sm">
                    Phone &bull; Office 143
                  </div>
                </div>

                {/* Tile 5 */}
                <div className="p-3 rounded-xl bg-slate-800/85 border border-slate-700/70 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Opened By</span>
                  </div>
                  <div className="font-bold text-white text-xs sm:text-sm">
                    Opened by 17 (Staff)
                  </div>
                </div>

                {/* Tile 6 */}
                <div className="p-3 rounded-xl bg-slate-800/85 border border-slate-700/70 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Network className="w-3.5 h-3.5 text-blue-400" />
                    <span>Subcategory</span>
                  </div>
                  <div className="font-bold text-white text-xs sm:text-sm">Subcategory 170</div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Model Risk Verdict */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-slate-950 border border-indigo-500/30 text-white shadow-inner space-y-4">
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                    Decision Support Engine
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    &lt; 50ms Inference
                  </span>
                </div>

                {/* Probability Score */}
                <div className="pt-3 space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium text-slate-300">
                      Reassignment Probability
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-rose-400">78%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400 to-rose-500 h-2 rounded-full w-[78%]"></div>
                  </div>
                </div>

                {/* Pattern Diagnosis */}
                <p className="text-xs text-slate-300 mt-3 leading-relaxed font-normal">
                  Historical triage patterns indicate that{' '}
                  <strong className="text-white">82.4%</strong> of tickets with this
                  symptom/category bounce when assigned to General L1.
                </p>
              </div>

              {/* Actionable Recommendation */}
              <div className="p-3.5 rounded-xl bg-blue-950/60 border border-blue-500/30 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Routing Recommendation</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  Route directly to Network Operations L2
                </div>
                <div className="text-[11px] text-slate-300">
                  Reduces MTTR by ~4.5 Hours & eliminates transfer hops
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature & Benefit Cards - Increased Font Size & Clear Readability */}
      <section aria-labelledby="benefits-heading" className="max-w-5xl mx-auto space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            Key Operational Benefits
          </div>
          <h2
            id="benefits-heading"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
          >
            Engineered for IT Operations Triage
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed font-normal">
            Decision-support insights derived from historical ticket patterns, without modifying
            your core ITSM workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Reduce MTTR & Multi-Hops */}
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between space-y-5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/25">
                  <Clock className="w-5.5 h-5.5" />
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  <TrendingDown className="w-3.5 h-3.5 text-blue-600" />
                  38% Lower MTTR
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Reduce MTTR & Multi-Hops
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-1">
                  Minimize ticket transfers across teams
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Flags high-risk tickets at creation time to prevent multi-hop reassignment loops and
                shorten resolution time.
              </p>

              {/* Clear Micro-Stat */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Routing Trajectory</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/70 text-xs">
                  1-Hop Resolution
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs sm:text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Predictive triage impact</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Data-Driven Triage */}
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between space-y-5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/25">
                  <GitMerge className="w-5.5 h-5.5" />
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  11 Attributes
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Data-Driven Triage
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-1">
                  Trained on verified incident mining datasets
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Identifies subtle risk combinations across symptoms, categories, and initial groups
                using historical log patterns.
              </p>

              {/* Clear Micro-Stat */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Feature Inputs</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/70 text-xs">
                  Zero Data Leakage
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs sm:text-sm font-bold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Zero data leakage guarantee</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Human-in-the-Loop */}
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-lg hover:border-purple-300 transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between space-y-5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm shadow-purple-500/25">
                  <CheckCircle2 className="w-5.5 h-5.5" />
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  Operator Governed
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Human-in-the-Loop
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-1">
                  Decision support recommendations, never blind automation
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Delivers probabilistic risk guidance to triage officers while keeping full human
                control over final assignment.
              </p>

              {/* Clear Micro-Stat */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Safety Policy</span>
                <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200/70 text-xs">
                  100% Supervised
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs sm:text-sm font-bold text-purple-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Assists human judgment</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Modern Triage Workflow Comparison: Traditional vs. RouteRight AI */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center sm:text-left max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <GitCompare className="w-3.5 h-3.5 text-slate-600" />
            Operational Benchmark
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Triage Workflow: Traditional vs. RouteRight AI
          </h3>
          <p className="text-sm text-slate-500">
            Visualizing the difference in incident routing efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Workflow Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white border border-rose-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-6">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-amber-500" />

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Without Prediction Support
                    </h4>
                    <p className="text-xs text-slate-400">Sequential trial-and-error escalation</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                  Multi-Hop Delays
                </span>
              </div>

              {/* Connected Timeline Steps */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-rose-100">
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-4 ring-rose-50">
                    1
                  </span>
                  <div className="text-xs font-bold text-slate-800">
                    Ticket opened & assigned to General Helpdesk
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Dispatched without reassignment probability scoring.
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-4 ring-rose-50">
                    2
                  </span>
                  <div className="text-xs font-bold text-slate-800">
                    Tier 1 discovers complex infrastructure root cause (4h later)
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Unnecessary queue wait time before discovery.
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-4 ring-rose-50">
                    3
                  </span>
                  <div className="text-xs font-bold text-slate-800">
                    Ticket reassigned to Network Ops &rarr; Reassigned to Cloud Security
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Repeated handoffs prolonging service disruption.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-semibold">
                Result: 2-3 reassignments, extended MTTR, frustrated users.
              </span>
            </div>
          </div>

          {/* RouteRight AI Assisted Workflow Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white border border-emerald-300 p-6 sm:p-7 shadow-md flex flex-col justify-between space-y-6 ring-1 ring-emerald-500/20">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600" />

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">With RouteRight AI</h4>
                    <p className="text-xs text-emerald-600 font-medium">
                      Proactive decision intelligence
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
                  First-Touch Precision
                </span>
              </div>

              {/* Connected Timeline Steps */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-100">
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-4 ring-emerald-50">
                    1
                  </span>
                  <div className="text-xs font-bold text-slate-800">
                    Ticket opened with initial 11 parameters
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Pre-assignment parameters evaluated in &lt; 50ms inference.
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-4 ring-emerald-50">
                    2
                  </span>
                  <div className="text-xs font-bold text-slate-800">
                    Model flags high reassignment risk with General Helpdesk
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Operator alerted before sending ticket to wrong queue.
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-4 ring-emerald-50">
                    3
                  </span>
                  <div className="text-xs font-bold text-slate-800">
                    Triage officer assigns directly to Cloud Security on first touch
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Human-in-the-loop decision routing directly to right team.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">
                Result: Single-hop resolution, reduced downtime, human-in-control.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* High-End Call to Action Banner & Bottom Disclaimer */}
      <section className="max-w-5xl mx-auto pt-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-slate-100 p-8 sm:p-12 shadow-2xl border border-slate-800">
          <div
            className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-medium backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Production-Grade Standalone Frontend
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ready to evaluate an incoming ticket?
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Input ticket parameters available at creation time (contact type, location,
                category, symptom, and initial group) to assess reassignment risk instantly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link to="/predict">
                <Button
                  variant="gradient"
                  size="lg"
                  rightIcon={<ArrowUpRight className="w-5 h-5" />}
                  className="shadow-xl"
                >
                  Open Predictor Form
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Closing Advisory Notice */}
        <p className="text-center text-xs text-slate-400 max-w-2xl mx-auto mt-3.5 leading-relaxed">
          Decision-support tool for IT service desks. Designed to support human triage officers;
          does not automatically reassign tickets.
        </p>
      </section>
    </div>
  );
};

export default HomePage;
