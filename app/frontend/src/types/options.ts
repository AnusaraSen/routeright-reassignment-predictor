/**
 * RouteRight AI - Ticket Option Types
 * Categorical values for ticket creation attributes.
 */

export interface OptionItem {
  value: string;
  label: string;
  description?: string;
}

export interface TicketOptions {
  opened_by: OptionItem[];
  contact_type: OptionItem[];
  location: OptionItem[];
  category: OptionItem[];
  subcategory: OptionItem[];
  u_symptom: OptionItem[];
  impact: OptionItem[];
  urgency: OptionItem[];
  priority: OptionItem[];
  assignment_group: OptionItem[];
}
