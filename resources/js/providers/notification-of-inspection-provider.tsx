import { NotificationOfInspection } from '@/types';
import React from 'react';

export const NotificationOfInspectionContext = React.createContext<NotificationOfInspection|null>(null);

export const NotificationOfInspectionProvider = NotificationOfInspectionContext.Provider;

export function useNotificationOfInspection(): NotificationOfInspection | null {
  return React.useContext(NotificationOfInspectionContext);
}
