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
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/common/Card';

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

      {/* Feature & Benefit Cards */}
      <section aria-labelledby="benefits-heading" className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            Key Operational Benefits
          </div>
          <h2 id="benefits-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Engineered for IT Operations Triage
          </h2>
          <p className="text-sm text-slate-500">
            Decision-support insights derived from historical ticket patterns, without modifying
            your core ITSM workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card
            hoverEffect
            className="group relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div>
              <CardHeader className="flex items-start justify-between pb-3">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                  <TrendingDown className="w-3 h-3 text-blue-600" />
                  Lower Latency
                </span>
              </CardHeader>
              <CardContent className="space-y-2 pt-1">
                <CardTitle>Reduce MTTR & Multi-Hops</CardTitle>
                <CardDescription>
                  Minimize triage delays before tickets bounce across queues
                </CardDescription>
                <p className="text-sm text-slate-600 leading-relaxed pt-2">
                  Tickets reassigned multiple times suffer severe resolution delays. By flagging
                  high reassignment risk at creation time, operators double-check assignments before
                  tickets languish in incorrect queues.
                </p>
              </CardContent>
            </div>
            <div className="px-6 pb-5 pt-2 text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
              <span>Predictive triage impact</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Card>

          {/* Card 2 */}
          <Card
            hoverEffect
            className="group relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div>
              <CardHeader className="flex items-start justify-between pb-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20">
                  <GitMerge className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <Layers className="w-3 h-3 text-emerald-600" />
                  11 Attributes
                </span>
              </CardHeader>
              <CardContent className="space-y-2 pt-1">
                <CardTitle>Data-Driven Triage</CardTitle>
                <CardDescription>
                  Trained rigorously on verified incident mining datasets
                </CardDescription>
                <p className="text-sm text-slate-600 leading-relaxed pt-2">
                  Learns from historical IT service logs to identify subtle combinations of
                  symptoms, categories, and initial assignment groups that frequently initiate
                  inefficient reassignment chains.
                </p>
              </CardContent>
            </div>
            <div className="px-6 pb-5 pt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
              <span>Zero data leakage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Card>

          {/* Card 3 */}
          <Card
            hoverEffect
            className="group relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div>
              <CardHeader className="flex items-start justify-between pb-3">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 ring-1 ring-purple-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                  <ShieldCheck className="w-3 h-3 text-purple-600" />
                  Operator Governed
                </span>
              </CardHeader>
              <CardContent className="space-y-2 pt-1">
                <CardTitle>Human-in-the-Loop</CardTitle>
                <CardDescription>
                  Decision support recommendations, never blind automation
                </CardDescription>
                <p className="text-sm text-slate-600 leading-relaxed pt-2">
                  RouteRight AI provides decision recommendations rather than autonomous rerouting.
                  Service-desk agents maintain full operational authority to validate or adjust
                  routing according to company standard procedures.
                </p>
              </CardContent>
            </div>
            <div className="px-6 pb-5 pt-2 text-xs font-semibold text-purple-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
              <span>Assists human judgment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Card>
        </div>
      </section>

      {/* Before vs After Comparison */}
      <section className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center sm:text-left max-w-2xl">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Triage Workflow: Traditional vs. RouteRight AI
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Visualizing the difference in incident routing efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          {/* Traditional */}
          <div className="p-5 rounded-xl bg-white border border-rose-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-800">Without Prediction Support</span>
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold text-xs">
                Multi-Hop Delays
              </span>
            </div>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs shrink-0">
                  1
                </span>
                <span>Ticket opened & assigned to General Helpdesk</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs shrink-0">
                  2
                </span>
                <span>Tier 1 discovers complex infrastructure root cause (4h later)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs shrink-0">
                  3
                </span>
                <span>Ticket reassigned to Network Ops &rarr; Reassigned to Cloud Security</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-rose-700 font-medium text-xs">
              Result: 2-3 reassignments, extended MTTR, frustrated users.
            </div>
          </div>

          {/* With RouteRight AI */}
          <div className="p-5 rounded-xl bg-white border border-emerald-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-800">With RouteRight AI</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-xs">
                First-Touch Precision
              </span>
            </div>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0">
                  1
                </span>
                <span>Ticket opened with initial 11 parameters</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0">
                  2
                </span>
                <span>Model flags high reassignment risk with General Helpdesk</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0">
                  3
                </span>
                <span>Triage officer assigns directly to Cloud Security on first touch</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-emerald-700 font-medium text-xs">
              Result: Single-hop resolution, reduced downtime, human-in-control.
            </div>
          </div>
        </div>
      </section>

      {/* High-End Call to Action Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-slate-100 p-8 sm:p-12 shadow-2xl border border-slate-800">
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
              Input ticket parameters available at creation time (contact type, location, category,
              symptom, and initial group) to assess reassignment risk instantly.
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
      </section>
    </div>
  );
};

export default HomePage;
