import { createContext, useContext } from 'react';
import { Org } from '@/types';

export const OrgContext = createContext<Org|null>(null);

export function useOrg() {
  return useContext(OrgContext);
}

export const OrgProvider = OrgContext.Provider;
