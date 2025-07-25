import { LucideIcon } from 'lucide-react';
import { MainNavItem } from '@/components/nav-main';

export interface DialogFormProps<T = BaseModel> {
  children?: React.ReactNode;
  onSubmit: (data: T) => void;
  value?: T | null
  open?: boolean
  onOpenChange?: (open: boolean) => void;
}

export interface Org extends BaseModel {
  name: string;
}

export interface Auth {
  user: User;
  org: Org;
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

export interface User extends BaseModel {
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  user_role?: UserRole
}

export interface Contact extends BaseModel {
  email: string | null;
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
  created_at: string;
  updated_at: string;
  deleted_at?: string | null; // Optional for soft deletes
}

export interface Client extends BaseModel {
  business_name: string;
  org_id: number;
  user_id: number;
  user?: User;
  coordinator_id: number | null;
  coordinator?: User;
  reviewer_id?: number | null;
  reviewer?: User;
  address_id: number | null;
  address?: Address;
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
  quote_id: number | null;
  quote?: Quote;
  title: string;
  po_number: string;
  org_id: number;
  org?: Org;
  project_type_id: number;
  project_type?: ProjectType;
  client_id: number | null;
  client?: Client;
  budget: number | null;
  spent: number | null;
  status: number;
}

export interface AssignmentType extends BaseModel {
  name: string;
  org_id: number | null;
}

export interface PurchaseOrder extends BaseModel {
  org_id: number;
  org?: Org;
  name: string;
}

export interface Assignment extends BaseModel {
  org_id: number;
  org?: Org;
  operation_org_id: number | null;
  operation_org?: Org;
  assignment_type_id: number | null;
  assignment_type?: AssignmentType;
  project_id: number;
  project?: Project;
  vendor_id: number | null;
  vendor?: Vendor;
  sub_vendor_id: number | null;
  sub_vendor?: Vendor;
  report_required: boolean;
  description: string | null;
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

export interface Timesheet extends BaseModel {
  assignment_id: number;
  assignment?: Assignment;
  hours: number;
  km_traveled: number;
  timesheet_items?: TimesheetItem[];
  timesheet_items_count?: number;
}

export interface TimesheetItem extends BaseModel {
  timesheet_id: number;
  timesheet?: Timesheet;
  user_id: number;
  user?: User;
  item_number: string | null;
  date: string | null;
  week_number: number | null;
  hours: number;
  work_hours: number;
  travel_hours: number;
  report_hours: number;
  days: number;
  overnights: number;
  km_traveled: number;
  approved: boolean;
}
