import { z } from 'zod';

export const predictionFormSchema = z.object({
  caller_id: z.string().optional(),
  opened_at: z.string().min(1, 'Please select incident creation date and time'),
  opened_by: z.string().min(1, 'Please select who opened the ticket'),
  contact_type: z.string().min(1, 'Please select a contact method'),
  location: z.string().min(1, 'Please select an incident location'),
  category: z.string().min(1, 'Please select an incident category'),
  subcategory: z.string().min(1, 'Please select a subcategory'),
  u_symptom: z.string().min(1, 'Please select a reported symptom'),
  impact: z.string().min(1, 'Please select impact severity'),
  urgency: z.string().min(1, 'Please select urgency level'),
  priority: z.string().min(1, 'Please select ticket priority'),
  assignment_group: z.string().min(1, 'Please select a target queue'),
});

export type PredictionFormSchemaType = z.infer<typeof predictionFormSchema>;
