import { createContext, useContext } from 'react';
import { PurchaseOrder } from '@/types';

export const PurchaseOrderContext = createContext<PurchaseOrder|null>(null);

export function usePurchaseOrder() {
  const context = useContext(PurchaseOrderContext);
  if (context === undefined) {
    throw new Error('usePurchaseOrder must be used within a PurchaseOrderProvider');
  }
  return context;
}

export const PurchaseOrderProvider = PurchaseOrderContext.Provider;
