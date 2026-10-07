import { TicketOptions } from '@/types/options';

export const mockTicketOptions: TicketOptions = {
  opened_by: [
    { value: 'Opened by  17', label: 'Tier 1 Support' },
    { value: 'Opened by  24', label: 'Operations Lead' },
    { value: 'Opened by  8', label: 'Helpdesk Staff' },
    { value: 'Opened by  108', label: 'Regional Admin' },
    { value: 'Opened by  131', label: 'System Operator' },
    { value: 'Opened by  180', label: 'IT Analyst' },
  ],
  contact_type: [
    { value: 'Phone', label: 'Phone Call (Voice)' },
    { value: 'Email', label: 'Email Dispatch' },
    { value: 'Self-service', label: 'Self-Service Portal' },
    { value: 'Direct human', label: 'Direct Walk-in / Human' },
  ],
  location: [
    { value: 'Location 143', label: 'North America HQ' },
    { value: 'Location 108', label: 'EU Tech Center' },
    { value: 'Location 204', label: 'APAC Regional' },
    { value: 'Location 161', label: 'Data Center East' },
    { value: 'Location 93', label: 'Branch Office 12' },
    { value: 'Location 51', label: 'Remote Operations' },
  ],
  category: [
    { value: 'Category 26', label: 'Network / VPN Infrastructure' },
    { value: 'Category 42', label: 'Identity & Authentication' },
    { value: 'Category 34', label: 'Enterprise Software & Cloud' },
    { value: 'Category 9', label: 'Hardware & Workstation' },
    { value: 'Category 53', label: 'Database & Storage' },
    { value: 'Category 20', label: 'Telephony & Collaboration' },
  ],
  subcategory: [
    { value: 'Subcategory 170', label: 'VPN Gateway Timeout' },
    { value: 'Subcategory 125', label: 'SSO / Token Sync' },
    { value: 'Subcategory 9', label: 'Disk Volume I/O' },
    { value: 'Subcategory 174', label: 'Switch Port Error' },
    { value: 'Subcategory 223', label: 'License Provisioning' },
    { value: 'Subcategory 62', label: 'Peripherals Driver' },
  ],
  u_symptom: [
    { value: 'Symptom 491', label: 'Global Auth Timeout' },
    { value: 'Symptom 102', label: 'Packet Loss / High Latency' },
    { value: 'Symptom 208', label: 'Application Unresponsive' },
    { value: 'Symptom 534', label: 'Access Denied 403' },
    { value: 'Symptom 296', label: 'Hardware Power Failure' },
    { value: 'Symptom 4', label: 'Routine Configuration Request' },
  ],
  impact: [
    { value: '1 - High', label: '1 - High (Organization-wide)' },
    { value: '2 - Medium', label: '2 - Medium (Departmental)' },
    { value: '3 - Low', label: '3 - Low (Individual User)' },
  ],
  urgency: [
    { value: '1 - High', label: '1 - High (Immediate Critical)' },
    { value: '2 - Medium', label: '2 - Medium (Standard SLA)' },
    { value: '3 - Low', label: '3 - Low (Scheduled Maintenance)' },
  ],
  priority: [
    { value: '1 - Critical', label: '1 - Critical' },
    { value: '2 - High', label: '2 - High' },
    { value: '3 - Moderate', label: '3 - Moderate' },
    { value: '4 - Low', label: '4 - Low' },
  ],
  assignment_group: [
    { value: 'Group 70', label: 'General Service Desk L1 (Group 70)' },
    { value: 'Group 24', label: 'Network Operations L2 (Group 24)' },
    { value: 'Group 25', label: 'Cloud Infrastructure & Security (Group 25)' },
    { value: 'Group 10', label: 'Desktop End-User Support (Group 10)' },
    { value: 'Group 39', label: 'Database Administration (Group 39)' },
    { value: 'Group 64', label: 'Identity & Access Management (Group 64)' },
  ],
};

export const subcategoryByCategoryMapping: Record<string, string[]> = {
  'Category 26': ['Subcategory 170', 'Subcategory 174'],
  'Category 42': ['Subcategory 125', 'Subcategory 223'],
  'Category 34': ['Subcategory 223', 'Subcategory 125'],
  'Category 9': ['Subcategory 62', 'Subcategory 9'],
  'Category 53': ['Subcategory 9'],
  'Category 20': ['Subcategory 170', 'Subcategory 62'],
};

export const getSubcategoriesForCategory = (category?: string) => {
  if (!category || !subcategoryByCategoryMapping[category]) {
    return mockTicketOptions.subcategory;
  }
  const allowed = new Set(subcategoryByCategoryMapping[category]);
  const filtered = mockTicketOptions.subcategory.filter((sub) => allowed.has(sub.value));
  return filtered.length > 0 ? filtered : mockTicketOptions.subcategory;
};

