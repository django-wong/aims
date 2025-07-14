import { LucideIcon } from 'lucide-react';

export interface Org extends BaseModel {
  name: string;
}

export interface Auth {
    user: User;
    org: Org
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

export type FlashMessageType  = 'message' | 'error';

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
    flash: {
      [K in FlashMessageType]: string
    }
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
  postal_code: string;
  suburb?: string | null;
  country: string;
}

export interface BaseModel {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string|null; // Optional for soft deletes
  [key: string]: unknown; // This allows for additional properties...
}

export interface Client extends BaseModel {
  name: string;
  first_name: string;
  last_name: string|null;
}

export interface Project extends BaseModel {
  name: string;
  description: string|null;
  status: string;
  client_id: number|null;
  client?: Partial<Client>;
  org_id: number|null;
  org?: Partial<Org>;
  assigned_org_id?: number|null;
  assigned_org?: Partial<Org>;
}
