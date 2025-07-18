import { LucideIcon } from 'lucide-react';
import { MainNavItem } from '@/components/nav-main';

export interface DialogFormProps {
  children: React.ReactNode;
  onSuccess: () => void;
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
}

export interface User extends BaseModel {
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
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
  full_address?: string|null; // Optional, can be computed from other fields
}

export interface BaseModel {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null; // Optional for soft deletes
  [key: string]: unknown; // This allows for additional properties...
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

export interface Project extends BaseModel {
  quote_id: number | null;
  quote?: Quote;
  title: string;
  code: string;
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
  assignment_type_id: number;
  assignment_type?: AssignmentType;
  client_id: number;
  client?: Client;
  project_id: number;
  project?: Project;
  purchase_order_id: number | null;
  purchase_order?: PurchaseOrder;
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
