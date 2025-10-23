import { createContext, useContext } from 'react';
import { Expense } from '@/types';

export const ExpenseContext = createContext<Expense|null>(null);

export function useExpense() {
  return useContext(ExpenseContext);
}

export const ExpenseProvider = ExpenseContext.Provider;
