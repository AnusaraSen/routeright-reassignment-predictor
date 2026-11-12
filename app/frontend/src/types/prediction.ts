/**
 * RouteRight AI - Prediction Type Contracts
 * Models prediction inputs and Two-Stage inference responses.
 */

export interface PredictionFormData {
  caller_id?: string;
  opened_at: string;
  opened_by: string;
  contact_type: string;
  location: string;
  category: string;
  subcategory: string;
  u_symptom: string;
  impact: string;
  urgency: string;
  priority: string;
  assignment_group: string;
}

export type PredictionRequest = PredictionFormData;

export interface DepartmentRecommendation {
  department: string;
  probability: number;
  rank: number;
}

export interface PredictionResponse {
  prediction: 0 | 1;
  label: string;
  probability: number;
  risk_level: 'low' | 'medium' | 'high';
  decision_threshold: number;
  model_name: string;
  status: 'success';
  inference_time_ms: number;
  predicted_department?: string | null;
  recommended_departments?: DepartmentRecommendation[];
}
