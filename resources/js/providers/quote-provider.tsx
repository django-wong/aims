import { createContext, useContext } from 'react';
import { Quote } from '@/types';

export const QuoteContext = createContext<Quote|null>(null);

export function useQuote() {
  return useContext(QuoteContext);
}

export const QuoteProvider = QuoteContext.Provider;
