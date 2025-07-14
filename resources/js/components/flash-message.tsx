import { PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { toast } from 'sonner';

export function FlashMessage(props: PropsWithChildren) {
  const { props: {
    flash
  } } = usePage<SharedData>();


  if (flash.message) {
    toast.message(flash.message);
  }

  if (flash.error) {
    toast.error(flash.error);
  }

  return <>{props.children}</>;
}
