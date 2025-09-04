import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

export function useAuth() {
  const {
    props: {
      auth
    }
  } = usePage<SharedData>();

  return auth;
}
