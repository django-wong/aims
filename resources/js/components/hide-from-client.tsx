import { PropsWithChildren } from 'react';
import { useIsClient, useRole } from '@/hooks/use-role';

export function HideFromClient(props: PropsWithChildren) {
  const isClient = useIsClient();

  if (isClient) {
    return null;
  }

  return <>{props.children}</>;
}

export function VisibleToClient(props: PropsWithChildren) {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return <>{props.children}</>;
}

export function VisibleToOperator(props: PropsWithChildren) {
  const role = useRole();

  if (role !== 5) {
    return null;
  }

  return <>{props.children}</>;
}

export function VisibleToStaffAndAbove(props: PropsWithChildren) {
  const role = useRole();

  if (!role || [1,2,3,4].indexOf(role) === -1) {
    return null;
  }

  return <>{props.children}</>;
}
