import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

export function useOrg() {
  const {
    props: {
      auth: {
        org
      }
    }
  } = usePage<SharedData>();

  return org;
}
