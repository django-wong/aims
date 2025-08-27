import { LucideIcon } from 'lucide-react';
import { MainNavItem } from '@/components/nav-main';

export interface DialogFormProps<T = BaseModel, R = T> {
  children?: React.ReactNode;
  onSubmit: (data: R) => void;
  value?: T | null
  open?: boolean
  onOpenChange?: (open: boolean) => void;
  asChild?: boolean;
}

export interface Org extends BaseModel {
  name: string;
}

export interface Auth {
  user?: User;
  org?: Org;
  impersonating: boolean;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export type FlashMessageType = 'message' | 'error';

export interface SharedData {
  menu: {
    main: {
      [key: string]: MainNavItem
    }
  };
  name: string;
  quote: { message: string; author: string };
  auth: Auth;

  flash: {
    [K in FlashMessageType]: string;
  };

  [key: string]: unknown;
}

export interface UserRole extends BaseModel {
  user_id: number;
  org_id: number;
  role: number; // 1=system, 2=org admin, 3=finance, 4=pm, 5=inspector, 6=client, 7=vendor, 8=staff
}

export interface InspectorProfile extends BaseModel {
  user_id: number;
  address_id: number | null;
  address?: Address;
  initials: string | null;
  hourly_rate: number;
  travel_rate: number;
  new_hourly_rate: number | null;
  new_travel_rate: number | null;
  new_rate_effective_date: string | null; // date string in YYYY-MM-DD format
  assigned_identifier: string | null;
  include_on_skills_matrix: boolean;
  notes: string | null;
}

export interface User extends BaseModel {
  name: string;
  first_name: string;
  last_name: string;
  title: string | null;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  user_role?: UserRole
  inspector_profile?: InspectorProfile
  address_id: number | null;
  address?: Address;
  skills?: Skill[];
}

export interface Contact extends BaseModel {
  contactable_id: number;
  contactable_type: string; // e.g. 'App\\Models\\Client', '
  email: string | null;
  mobile: string | null;
  title: string | null;
  first_name: string;
  last_name: string;
  name: string; // Computed from first_name and last_name
  phone: string | null;
  company: string | null;
  website: string | null;
  business_type: string | null; // e.g. 'client', 'vendor', 'sub_vendor'
  notes: string | null;
}

export interface Address extends BaseModel {
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  full_address?: string|null; // Computed from other fields
}

export interface Model {
  id: number;
}

export interface BaseModel extends Model {
  [key: string]: any; // Allow additional properties
  created_at: string;
  updated_at: string;
  deleted_at?: string | null; // Optional for soft deletes
}

export interface Client extends BaseModel {
  business_name: string;
  org_id: number;
  user_id: number;
  user?: User;
  logo_url: string;
  coordinator_id: number | null;
  coordinator?: User;
  reviewer_id?: number | null;
  reviewer?: User;
  address_id: number | null;
  address?: Address;
  notes: string | null;
  invoice_reminder: number | null;
}

interface Quote extends BaseModel {
  title: string;
}

export interface ProjectType extends BaseModel {
  org_id: number | null;
  name: string;
}

export interface Project extends BaseModel {
  title: string;
  number: string;
  org_id: number;
  org?: Org;
  project_type_id: number;
  project_type?: ProjectType;
  client_id: number | null;
  client?: Client;
}

export interface AssignmentType extends BaseModel {
  name: string;
  org_id: number | null;
}

interface ThreeStageAlert {
  first_alert_threshold: number;
  first_alert_at: string | null;
  second_alert_threshold: number;
  second_alert_at: string | null;
  final_alert_threshold: number;
  final_alert_at: string | null;
}

export interface PurchaseOrder extends BaseModel, ThreeStageAlert {
  org_id: number;
  org?: Org;
  title: string;
  project_id: number | null;
  project?: Project;
  quote_id: number | null;
  quote?: Quote;
  budget: number;
  usage: number;
  hourly_rate: number;
  budgeted_hours: number;
}

export interface Assignment extends BaseModel {
  org_id: number;
  org?: Org;
  operation_org_id: number | null;
  operation_org?: Org;
  assignment_type_id: number;
  assignment_type?: AssignmentType;
  inspector_id: number;
  inspector?: User;
  project_id: number;
  project?: Project;
  purchase_order_id: number | null;
  purchase_order?: PurchaseOrder;
  vendor_id: number | null;
  vendor?: Vendor;
  sub_vendor_id: number | null;
  sub_vendor?: Vendor;
  report_required: boolean;
  description: string | null;
  notes: string | null;
  timesheets?: Timesheet[];

  // Visit information
  first_visit_date: string | null;
  visit_frequency: string | null;
  total_visits: number | null;
  hours_per_visit: number | null;
  visit_contact_id: number | null;
  visit_contact?: Contact;

  // Scope of assignment (booleans)
  pre_inspection_meeting: boolean;
  final_inspection: boolean;
  dimensional: boolean;
  sample_inspection: boolean;
  witness_of_tests: boolean;
  monitoring: boolean;
  packing: boolean;
  document_review: boolean;
  expediting: boolean;
  audit: boolean;

  // Status/flash report/exit call
  exit_call: boolean;
  flash_report: boolean;
  contact_details: string | null;
  contact_email: string | null;

  // Report formats
  reporting_format: number;
  reporting_frequency: number;
  send_report_to_email: string | null;
  timesheet_format: number;
  ncr_format: number;
  punch_list_format: number;
  irn_format: number;
  document_stamp: number;

  // Additional fields
  equipment: string | null;
  special_notes: string | null;
}

export type Invoiceable = {
  invoiceable_id: number;
} & (
  | {
      invoiceable_type: 'App\\Models\\Client';
      invoiceable?: Client;
    }
  | {
      invoiceable_type: 'App\\Models\\Org';
      invoiceable?: Org;
    }
);

interface InvoiceBase extends BaseModel {
  assignment_id: number;
  assignment?: Assignment;
}

export type Invoice = InvoiceBase & Invoiceable;

export type Literal<T> = Omit<T, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

export type PagedResponse<T = Record<string, unknown>> = {
  data: T[];
  total: number;
  last_page: number;
  first_page: number;
}

export interface Vendor extends BaseModel {
  org_id: number;
  name: string;
  org?: Org;
  business_name: string;
  address_id: number | null;
  address?: Address;
  notes: string | null
}

export interface Comment<T = unknown> extends BaseModel {
  content: string;
  private: boolean;
  commentable_type: string;
  commentable_id: number;
  commentable?: T
  user_id: number;
  user?: User;
  attachments?: Attachment<Comment>[];
}

export interface Attachment<T = unknown> extends BaseModel {
  attachable_type: string;
  attachable_id: number;
  attachable?: T
  name: string;
  mime_type: string|null;
  path: string;
  disk: string;
  size: number;
}

export enum TimesheetStatus {
  Draft = 0,
  Reviewing = 1,
  Approved = 2,
  ContractHolderApproved = 3,
  ClientApproved = 4,
  Invoiced = 5
}

export interface Timesheet extends BaseModel {
  assignment_id: number;
  assignment?: Assignment;

  start: string // YYYY-MM-DD
  end: string; // YYYY-MM-DD

  hours: number;
  status: TimesheetStatus;
  travel_distance: number;
  timesheet_items?: TimesheetItem[];
  timesheet_items_count?: number;
}

export interface TimesheetReport extends BaseModel {
  timesheet_id: number;
  type: string;
  is_closed: boolean;
  attachment?: Attachment
}

export interface TimesheetItem extends BaseModel {
  timesheet_id: number;
  timesheet?: Timesheet;

  user_id: number;
  user?: User;

  item_number: string | null;
  date: string;
  week_number: number | null;

  hours: number;
  work_hours: number;
  travel_hours: number;
  report_hours: number;
  hourly_rate: number;
  cost: number;

  days: number;
  overnights: number;

  travel_distance: number;
  travel_rate: number;
  travel_cost: number;

  total_expense: number;
  hotel: number;
  meals: number;
  rail_or_airfare: number;
  other: number;

  approved: boolean; // Reserved
}

export interface Budget extends BaseModel {
  rate_code: string;
  purchase_order_id: number;
  purchase_order?: PurchaseOrder;
  assignment_type_id: number;
  assignment_type?: AssignmentType;
  hourly_rate: number;
  budgeted_hours: number;
  travel_rate: number;
  budgeted_mileage: number;
}

export interface Skill extends BaseModel {
  org_id: number | null;
  code: string;
  report_code: string | null;
  i_e_a: string; // 'i' for internal, 'e' for external, 'a' for all
  description: string | null;
  sort: number;
}

export interface UserSkill extends BaseModel {
  user_id: number;
  skill_id: number;
  skill?: Skill;
  user?: User
}
