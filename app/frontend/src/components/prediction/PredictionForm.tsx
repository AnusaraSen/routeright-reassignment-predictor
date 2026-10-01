import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Flame,
  Layers,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tag,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { SearchableSelect } from '@/components/common/SearchableSelect';
import { mockTicketOptions, getSubcategoriesForCategory } from '@/mocks/options';
import { predictionFormSchema, PredictionFormSchemaType } from '@/schemas/prediction.schema';

export interface PredictionFormProps {
  onSubmit: (data: PredictionFormSchemaType) => Promise<void> | void;
  isEvaluating?: boolean;
  onReset?: () => void;
  className?: string;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({
  onSubmit,
  isEvaluating = false,
  onReset,
  className = '',
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PredictionFormSchemaType>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      opened_at: new Date().toISOString().slice(0, 16),
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

  const selectedCategory = watch('category');
  const selectedSubcategory = watch('subcategory');
  const selectedImpact = watch('impact');
  const selectedUrgency = watch('urgency');

  // Filter subcategories dynamically by selected category
  const availableSubcategories = getSubcategoriesForCategory(selectedCategory);

  // If selected subcategory is not allowed under the newly selected category, reset it
  useEffect(() => {
    if (selectedCategory && selectedSubcategory) {
      const isAllowed = availableSubcategories.some((sub) => sub.value === selectedSubcategory);
      if (!isAllowed) {
        setValue('subcategory', '', { shouldValidate: true });
      }
    }
  }, [selectedCategory, selectedSubcategory, availableSubcategories, setValue]);

  // Demo Incident Quick-Fill
  const handleLoadDemo = () => {
    setValue('opened_at', '2026-10-02T09:30', { shouldValidate: true });
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
    reset({
      opened_at: '',
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
    });
    if (onReset) {
      onReset();
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-white border border-slate-300 shadow-xl shadow-slate-200/80 p-6 sm:p-8 space-y-6 ring-1 ring-slate-900/5 ${className}`}
    >
      {/* Highlighting Top Accent Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

      {/* Card Header & Fast-Fill Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
            <SlidersHorizontal className="w-5.5 h-5.5" />
          </div>
          <div>
            <h2 id="ticket-form-heading" className="text-xl font-bold text-slate-900 tracking-tight">
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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

      {/* Form with 3 Logical Visual Sections */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Section 1: Ticket Origin & Reporter (4 Parameters) */}
        <div className="rounded-2xl border border-blue-200/90 bg-slate-50/90 p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>1. Ticket Origin & Reporter</span>
            </div>
            <span className="text-[11px] font-semibold text-blue-600">4 Parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Field 1: opened_at (datetime-local) */}
            <div className="space-y-1.5">
              <label htmlFor="opened_at" className="block text-xs font-bold text-slate-700">
                Opened At <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="opened_at"
                  type="datetime-local"
                  {...register('opened_at')}
                  className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${
                    errors.opened_at
                      ? 'bg-rose-50/30 border border-rose-300 text-slate-900 focus:border-rose-500'
                      : 'bg-white border border-slate-300 text-slate-800 hover:border-slate-400 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.opened_at && (
                <p className="text-[11px] font-medium text-rose-500">{errors.opened_at.message}</p>
              )}
            </div>

            {/* Field 2: opened_by (SearchableSelect) */}
            <Controller
              name="opened_by"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  id="opened_by"
                  label="Opened By"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={mockTicketOptions.opened_by}
                  placeholder="Select Staff ID..."
                  searchPlaceholder="Search staff ID or role..."
                  error={errors.opened_by?.message}
                />
              )}
            />

            {/* Field 3: contact_type (Normal select) */}
            <div className="space-y-1.5">
              <label htmlFor="contact_type" className="block text-xs font-bold text-slate-700">
                Contact Channel <span className="text-rose-500">*</span>
              </label>
              <select
                id="contact_type"
                {...register('contact_type')}
                className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400 transition-colors ${
                  errors.contact_type
                    ? 'bg-rose-50/30 border border-rose-300 text-slate-900 focus:border-rose-500'
                    : 'bg-white border border-slate-300 text-slate-800 focus:border-blue-500'
                }`}
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

            {/* Field 4: location (SearchableSelect) */}
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  id="location"
                  label="Location"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={mockTicketOptions.location}
                  placeholder="Select Site..."
                  searchPlaceholder="Search location or facility..."
                  error={errors.location?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Section 2: Incident Classification & Symptom (3 Parameters) */}
        <div className="rounded-2xl border border-indigo-200/90 bg-slate-50/90 p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
              <Tag className="w-4 h-4 text-indigo-600" />
              <span>2. Incident Classification & Symptoms</span>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600">3 Parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Field 5: category (SearchableSelect) */}
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  id="category"
                  label="Category"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={mockTicketOptions.category}
                  placeholder="Select Category..."
                  searchPlaceholder="Search category name..."
                  error={errors.category?.message}
                />
              )}
            />

            {/* Field 6: subcategory (SearchableSelect with dynamic category filtering) */}
            <Controller
              name="subcategory"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  id="subcategory"
                  label="Subcategory"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={availableSubcategories}
                  placeholder="Select Subcategory..."
                  searchPlaceholder="Search subcategory..."
                  helperText={
                    selectedCategory ? 'Filtered by active category' : 'Select category to filter'
                  }
                  error={errors.subcategory?.message}
                />
              )}
            />

            {/* Field 7: u_symptom (SearchableSelect) */}
            <Controller
              name="u_symptom"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  id="u_symptom"
                  label="Reported Symptom"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={mockTicketOptions.u_symptom}
                  placeholder="Select Symptom..."
                  searchPlaceholder="Search reported symptom..."
                  error={errors.u_symptom?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Section 3: Severity & Initial Routing (4 Parameters) */}
        <div className="rounded-2xl border border-purple-200/90 bg-slate-50/90 p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-900 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-purple-600" />
              <span>3. Severity & Initial Routing</span>
            </div>
            <span className="text-[11px] font-semibold text-purple-600">4 Parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Field 8: impact (Segmented buttons) */}
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
                    className={`py-2 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                      selectedImpact === val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-1 ring-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-2xs'
                    }`}
                  >
                    {val.split(' - ')[1]}
                  </button>
                ))}
              </div>
              {errors.impact && (
                <p className="text-[11px] font-medium text-rose-500">{errors.impact.message}</p>
              )}
            </div>

            {/* Field 9: urgency (Segmented buttons) */}
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
                    className={`py-2 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                      selectedUrgency === val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-1 ring-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-2xs'
                    }`}
                  >
                    {val.split(' - ')[1]}
                  </button>
                ))}
              </div>
              {errors.urgency && (
                <p className="text-[11px] font-medium text-rose-500">{errors.urgency.message}</p>
              )}
            </div>

            {/* Field 10: priority (Normal select) */}
            <div className="space-y-1.5">
              <label htmlFor="priority" className="block text-xs font-bold text-slate-700">
                Priority <span className="text-rose-500">*</span>
              </label>
              <select
                id="priority"
                {...register('priority')}
                className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400 transition-colors ${
                  errors.priority
                    ? 'bg-rose-50/30 border border-rose-300 text-slate-900 focus:border-rose-500'
                    : 'bg-white border border-slate-300 text-slate-800 focus:border-blue-500'
                }`}
              >
                {mockTicketOptions.priority.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p className="text-[11px] font-medium text-rose-500">{errors.priority.message}</p>
              )}
            </div>

            {/* Field 11: assignment_group (SearchableSelect - Target Support Queue) */}
            <Controller
              name="assignment_group"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  id="assignment_group"
                  label="Target Support Queue"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={mockTicketOptions.assignment_group}
                  placeholder="Select Queue..."
                  searchPlaceholder="Search support team or queue..."
                  error={errors.assignment_group?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strict Creation-Time Features &bull; Zero Post-Creation Leakage</span>
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
              disabled={isEvaluating}
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
  );
};

export default PredictionForm;
