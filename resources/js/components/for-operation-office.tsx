import { useIsOperationOffice } from '@/providers/assignment-provider';
import { PropsWithChildren } from 'react';

export function ForOperationOffice(props: PropsWithChildren) {
  const is = useIsOperationOffice();

  if (!is) {
    return null;
  }

  return <>{props.children}</>;
}
