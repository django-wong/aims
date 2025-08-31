import { createContext, useContext } from 'react';
import { Assignment, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export const AssignmentContext = createContext<Assignment|null>(null);

export function useIsOperationOffice() {
  const {
    props: {
      auth: {
        org
      }
    }
  } = usePage<SharedData>()

  const assignment = useAssignment();

  if (assignment?.operation_org_id && org?.id && assignment.operation_org_id === org.id) {
    return true;
  }

  return false;
}

export function useAssignment() {
  const context = useContext(AssignmentContext);
  if (context === undefined) {
    throw new Error('useAssignment must be used within a AssignmentProvider');
  }
  return context;
}

export const AssignmentProvider = AssignmentContext.Provider;
