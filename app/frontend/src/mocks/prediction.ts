import { PredictionFormData, PredictionResponse } from '@/types/prediction';

/**
 * Mock prediction logic that evaluates ticket patterns according to IT service desk triage rules.
 */
export const mockPredict = async (formData: PredictionFormData): Promise<PredictionResponse> => {
  // Simulate minimal inference network delay (150ms)
  await new Promise((resolve) => setTimeout(resolve, 150));

  // High risk heuristic: General Service Desk L1 (Group 70) assigned to complex Network, VPN, or Auth symptoms
  const isGeneralL1 = formData.assignment_group === 'Group 70';
  const isNetworkOrAuth =
    formData.category === 'Category 26' ||
    formData.category === 'Category 42' ||
    formData.subcategory === 'Subcategory 170' ||
    formData.u_symptom === 'Symptom 491' ||
    formData.u_symptom === 'Symptom 102';

  const isHighUrgency = formData.urgency === '1 - High' || formData.impact === '1 - High';

  if (isGeneralL1 && isNetworkOrAuth) {
    return {
      prediction: 1,
      label: 'Reassignment Required',
      probability: isHighUrgency ? 0.84 : 0.78,
      risk_level: 'high',
      confidence: 0.88,
      diagnosis:
        'Historical triage logs show 82.4% of tickets with this symptom/category bounce when initially routed to General L1.',
      recommendation: 'Route directly to Network Operations L2 or Cloud Infrastructure.',
      estimated_savings: 'Saves ~4.5 Hours MTTR & eliminates 2 triage hops.',
      inference_time_ms: 38,
    };
  }

  // If routed directly to specialist group (e.g. Group 24 or Group 25)
  if (formData.assignment_group === 'Group 24' || formData.assignment_group === 'Group 25') {
    return {
      prediction: 0,
      label: 'No Reassignment Required',
      probability: 0.14,
      risk_level: 'low',
      confidence: 0.92,
      diagnosis:
        'Specialist domain matches the reported symptom profile. First-touch resolution probability is high.',
      recommendation: 'Confirm current routing to target specialist team.',
      estimated_savings: 'Optimal first-touch path identified.',
      inference_time_ms: 42,
    };
  }

  // Moderate heuristic
  const isMediumRisk = formData.priority === '2 - High' || formData.priority === '1 - Critical';
  const probability = isMediumRisk ? 0.62 : 0.28;
  const prediction = probability >= 0.5 ? 1 : 0;

  return {
    prediction,
    label: prediction === 1 ? 'Reassignment Required' : 'No Reassignment Required',
    probability,
    risk_level: prediction === 1 ? 'medium' : 'low',
    confidence: 0.85,
    diagnosis:
      prediction === 1
        ? 'Secondary reassignment risk detected based on cross-team transfer logs.'
        : 'Ticket attributes align with standard single-queue resolution procedures.',
    recommendation:
      prediction === 1
        ? 'Verify skill tier availability before dispatch.'
        : 'Initial assignment queue is appropriate for standard resolution.',
    estimated_savings: prediction === 1 ? 'Saves ~2.1 Hours MTTR.' : 'Within standard SLA limits.',
    inference_time_ms: 40,
  };
};
