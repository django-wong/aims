import { useIsOperationOffice } from '@/providers/assignment-provider';
import { PropsWithChildren } from 'react';
import { useIsClient } from '@/hooks/use-role';

export function ForContractHolderOffice(props: PropsWithChildren) {
  const isOperationOffice = useIsOperationOffice();
  const isClient = useIsClient();

  if (isOperationOffice || isClient) {
    return null;
  }

  return <>{props.children}</>;
}
