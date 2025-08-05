import { PropsWithChildren, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { toast } from 'sonner';

/**
 * Display the flash message from laravel session. Make sure sonner is initialized first before using this component.
 *
 * @param props
 * @constructor
 */
export function FlashMessage() {
  const { props: {
    flash: {
      message, error
    }
  } } = usePage<SharedData>();

  useEffect(() => {
    if (message) {
      toast.message(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);


  return null;
}
