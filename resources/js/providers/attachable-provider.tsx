import { createContext, useContext } from 'react';

export interface Attachable {
  attachable_id: number;
  attachable_type: string;
  group?: string;
}

export const AttachableContext = createContext<Attachable|null>(null);

export function useAttachable() {
  const context = useContext(AttachableContext);
  if (context === undefined) {
    throw new Error('useAttachable must be used within a AttachableProvider');
  }
  return context;
}

export const AttachableProvider = AttachableContext.Provider;
