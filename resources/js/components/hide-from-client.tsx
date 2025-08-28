import { PropsWithChildren } from 'react';
import { useIsClient } from '@/hooks/use-role';

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
