import { createContext, useContext } from 'react';
import { Assignment } from '@/types';

export const AssignmentContext = createContext<Assignment|null>(null);

export function useAssignment() {
  const context = useContext(AssignmentContext);
  if (context === undefined) {
    throw new Error('useAssignment must be used within a AssignmentProvider');
  }
  return context;
}

export const AssignmentProvider = AssignmentContext.Provider;
