import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Flame,
  HelpCircle,
  Layers,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tag,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { mockTicketOptions } from '@/mocks/options';
import { mockPredict } from '@/mocks/prediction';
import { predictionFormSchema, PredictionFormSchemaType } from '@/schemas/prediction.schema';
import { PredictionResponse } from '@/types/prediction';

export const PredictPage: React.FC = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PredictionFormSchemaType>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      opened_by: '',
      contact_type: '',
      location: '',
      category: '',
      subcategory: '',
      u_symptom: '',
      impact: '2 - Medium',
      urgency: '2 - Medium',
      priority: '3 - Moderate',
      assignment_group: '',
    },
  });

  const selectedImpact = watch('impact');
  const selectedUrgency = watch('urgency');

  // Friendly Quick-Fill Demo Incident
  const handleLoadDemo = () => {
    setValue('opened_by', 'Opened by  17', { shouldValidate: true });
    setValue('contact_type', 'Phone', { shouldValidate: true });
    setValue('location', 'Location 143', { shouldValidate: true });
    setValue('category', 'Category 26', { shouldValidate: true });
    setValue('subcategory', 'Subcategory 170', { shouldValidate: true });
    setValue('u_symptom', 'Symptom 491', { shouldValidate: true });
    setValue('impact', '1 - High', { shouldValidate: true });
    setValue('urgency', '1 - High', { shouldValidate: true });
    setValue('priority', '2 - High', { shouldValidate: true });
    setValue('assignment_group', 'Group 70', { shouldValidate: true });
  };

  const handleResetForm = () => {
    reset();
    setPredictionResult(null);
  };

  const onSubmit = async (data: PredictionFormSchemaType) => {
    setIsEvaluating(true);
    try {
      const result = await mockPredict(data);
      setPredictionResult(result);
    } finally {
      setIsEvaluating(false);
    }
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

      {/* Two-Column Layout for Form and Prediction Result Shells */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Modern Friendly Form with High-Contrast Card */}
        <section
          aria-labelledby="ticket-form-heading"
          className="lg:col-span-7 xl:col-span-8 space-y-6"
        >
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-300 shadow-xl shadow-slate-200/80 p-6 sm:p-8 space-y-6 ring-1 ring-slate-900/5">
            {/* Highlighting Top Accent Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

            {/* Card Header & Fast-Fill Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
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

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Load Sample Incident
                </button>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  <Layers className="w-3 h-3 text-slate-500" />
                  11 Attributes
                </span>
              </div>
            </div>

            {/* The Interactive Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Section 1: Ticket Origin */}
              <div className="rounded-2xl border border-blue-200/90 bg-slate-50/90 p-4 sm:p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>1. Ticket Origin & Reporter</span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600">3 Parameters</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Field: opened_by */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Opened By <span className="text-rose-500">*</span>
                    </label>
                    <select
                      {...register('opened_by')}
                      className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 shadow-2xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400 transition-colors"
                    >
                      <option value="">Select Staff ID...</option>
                      {mockTicketOptions.opened_by.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.opened_by && (
                      <p className="text-[11px] font-medium text-rose-500">
                        {errors.opened_by.message}
                      </p>
                    )}
                  </div>

                  {/* Field: contact_type */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Contact Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      {...register('contact_type')}
                      className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 shadow-2xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400 transition-colors"
                    >
                      <option value="">Select Channel...</option>
                      {mockTicketOptions.contact_type.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.contact_type && (
                      <p className="text-[11px] font-medium text-rose-500">
                        {errors.contact_type.message}
                      </p>
                    )}
                  </div>

                  {/* Field: location */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Location <span className="text-rose-500">*</span>
                    </label>
                    <select
                      {...register('location')}
                      className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 shadow-2xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400 transition-colors"
                    >
                      <option value="">Select Site Location...</option>
                      {mockTicketOptions.location.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.location && (
                      <p className="text-[11px] font-medium text-rose-500">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Incident Classification */}
              <div className="rounded-2xl border border-indigo-200/90 bg-slate-50/90 p-4 sm:p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
                    <Tag className="w-4 h-4 text-indigo-600" />
                    <span>2. Incident Classification</span>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600">3 Parameters</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Field: category */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      {...register('category')}
                      className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 shadow-2xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400 transition-colors"
                    >
                      <option value="">Select Category...</option>
                      {mockTicketOptions.category.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-[11px] font-medium text-rose-500">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Field: subcategory */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Subcategory <span className="text-rose-500">*</span>
                    </label>
                    <select
                      {...register('subcategory')}
                      className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 shadow-2xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400 transition-colors"
                    >
                      <option value="">Select Subcategory...</option>
                      {mockTicketOptions.subcategory.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.subcategory && (
                      <p className="text-[11px] font-medium text-rose-500">
                        {errors.subcategory.message}
                      </p>
                    )}
                  </div>

                  {/* Field: u_symptom */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Reported Symptom <span className="text-rose-500">*</span>
                    </label>
                    <select
                      {...register('u_symptom')}
                      className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 shadow-2xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400 transition-colors"
                    >
                      <option value="">Select Symptom...</option>
                      {mockTicketOptions.u_symptom.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.u_symptom && (
                      <p className="text-[11px] font-medium text-rose-500">
                        {errors.u_symptom.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Severity & Initial Routing */}
              <div className="rounded-2xl border border-purple-200/90 bg-slate-50/90 p-4 sm:p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-900 uppercase tracking-wider">
                    <Flame className="w-4 h-4 text-purple-600" />
                    <span>3. Severity & Initial Routing</span>
                  </div>
                  <span className="text-[11px] font-semibold text-purple-600">4 Parameters</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {/* Field: impact */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Impact <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {['1 - High', '2 - Medium', '3 - Low'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setValue('impact', val, { shouldValidate: true })}
                          className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${
                            selectedImpact === val
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-1 ring-blue-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-2xs'
                          }`}
                        >
                          {val.split(' - ')[1]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Field: urgency */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Urgency <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {['1 - High', '2 - Medium', '3 - Low'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setValue('urgency', val, { shouldValidate: true })}
                          className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${
                            selectedUrgency === val
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-1 ring-blue-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-2xs'
                          }`}
                        >
                          {val.split(' - ')[1]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Field: priority */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Priority <span className="text-rose-500">*</span>
                    </label>
                    <select
                      {...register('priority')}
                      className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 shadow-2xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400 transition-colors"
                    >
                      {mockTicketOptions.priority.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Field: assignment_group */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Target Support Queue <span className="text-rose-500">*</span>
                    </label>
                    <select
                      {...register('assignment_group')}
                      className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 shadow-2xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400 transition-colors"
                    >
                      <option value="">Select Target Queue...</option>
                      {mockTicketOptions.assignment_group.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.assignment_group && (
                      <p className="text-[11px] font-medium text-rose-500">
                        {errors.assignment_group.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Strict Creation-Time Features &bull; No Post-Creation Leakage</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={handleResetForm}
                    leftIcon={
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-800 transition-transform duration-300 group-hover:-rotate-90" />
                    }
                    className="group text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-300 hover:border-slate-400 px-5 py-2.5 shadow-2xs hover:shadow-xs transition-all"
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    size="md"
                    isLoading={isEvaluating}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="text-xs font-bold px-6 shadow-md shadow-blue-500/25"
                  >
                    Evaluate Reassignment Risk
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Right Column: Dynamic Assessment Result Shell */}
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

            {/* Dynamic State: Result vs Awaiting */}
            {predictionResult ? (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* Result Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Model Verdict
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      predictionResult.prediction === 1
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {predictionResult.prediction === 1 ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    {predictionResult.label}
                  </span>
                </div>

                {/* Probability Gauge Bar */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-300 font-medium">
                      Reassignment Probability
                    </span>
                    <span
                      className={`text-3xl font-black ${
                        predictionResult.prediction === 1 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {Math.round(predictionResult.probability * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ${
                        predictionResult.prediction === 1
                          ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                          : 'bg-gradient-to-r from-teal-400 to-emerald-500'
                      }`}
                      style={{ width: `${Math.round(predictionResult.probability * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Pattern Diagnosis */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Pattern Diagnosis
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    {predictionResult.diagnosis}
                  </p>
                </div>

                {/* Recommendation Box */}
                {predictionResult.recommendation && (
                  <div
                    className={`p-3.5 rounded-2xl border space-y-1 ${
                      predictionResult.prediction === 1
                        ? 'bg-blue-950/60 border-blue-500/30'
                        : 'bg-emerald-950/60 border-emerald-500/30'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Advisory Recommendation</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      {predictionResult.recommendation}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {predictionResult.estimated_savings}
                    </div>
                  </div>
                )}
              </div>
            ) : (
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
            )}
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
              <span className="text-slate-400">Operational Model Specs</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PredictPage;
