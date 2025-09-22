import React from 'react';
import { Invoice } from '@/types';

export const InvoiceContext = React.createContext<Invoice|null>(null);

export const InvoiceProvider = InvoiceContext.Provider;

export function useInvoice() {
  return React.useContext(InvoiceContext);
}
