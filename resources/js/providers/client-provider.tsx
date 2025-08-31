import { createContext, useContext } from 'react';
import { Client } from '@/types';

export const ClientContext = createContext<Client|null>(null);

export function useClient() {
  return useContext(ClientContext);
}

export const ClientProvider = ClientContext.Provider;


export const ClientPermissionContext = createContext<{
  update: boolean;
}>({
  update: false,
});

export function useClientPermission() {
  return useContext(ClientPermissionContext);
}

export const ClientPermissionProvider = ClientPermissionContext.Provider;
