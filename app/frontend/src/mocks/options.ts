import { TicketOptions } from '@/types/options';

export const mockTicketOptions: TicketOptions = {
  opened_by: [
    { value: 'Opened by  17', label: 'Opened by 17 (Tier 1 Support)' },
    { value: 'Opened by  24', label: 'Opened by 24 (Operations Lead)' },
    { value: 'Opened by  8', label: 'Opened by 8 (Helpdesk Staff)' },
    { value: 'Opened by  108', label: 'Opened by 108 (Regional Admin)' },
    { value: 'Opened by  131', label: 'Opened by 131 (System Operator)' },
    { value: 'Opened by  180', label: 'Opened by 180 (IT Analyst)' },
  ],
  contact_type: [
    { value: 'Phone', label: 'Phone Call (Voice)' },
    { value: 'Email', label: 'Email Dispatch' },
    { value: 'Self-service', label: 'Self-Service Portal' },
    { value: 'Direct human', label: 'Direct Walk-in / Human' },
  ],
  location: [
    { value: 'Location 143', label: 'Location 143 (North America HQ)' },
    { value: 'Location 108', label: 'Location 108 (EU Tech Center)' },
    { value: 'Location 204', label: 'Location 204 (APAC Regional)' },
    { value: 'Location 161', label: 'Location 161 (Data Center East)' },
    { value: 'Location 93', label: 'Location 93 (Branch Office 12)' },
    { value: 'Location 51', label: 'Location 51 (Remote Operations)' },
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
    { value: 'Subcategory 170', label: 'Subcategory 170 (VPN Gateway Timeout)' },
    { value: 'Subcategory 125', label: 'Subcategory 125 (SSO / Token Sync)' },
    { value: 'Subcategory 9', label: 'Subcategory 9 (Disk Volume I/O)' },
    { value: 'Subcategory 174', label: 'Subcategory 174 (Switch Port Error)' },
    { value: 'Subcategory 223', label: 'Subcategory 223 (License Provisioning)' },
    { value: 'Subcategory 62', label: 'Subcategory 62 (Peripherals Driver)' },
  ],
  u_symptom: [
    { value: 'Symptom 491', label: 'Symptom 491 (Global Auth Timeout)' },
    { value: 'Symptom 102', label: 'Symptom 102 (Packet Loss / High Latency)' },
    { value: 'Symptom 208', label: 'Symptom 208 (Application Unresponsive)' },
    { value: 'Symptom 534', label: 'Symptom 534 (Access Denied 403)' },
    { value: 'Symptom 296', label: 'Symptom 296 (Hardware Power Failure)' },
    { value: 'Symptom 4', label: 'Symptom 4 (Routine Configuration Request)' },
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
