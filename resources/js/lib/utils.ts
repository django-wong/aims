import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function defaultHeaders(headers: Record<string, string|undefined> = {}): Record<string, string> {
  return {
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
    'Accept': 'application/json',
    ...headers,
  };
}
