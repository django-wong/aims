import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function useIsClient() {
  return useRole() === 6;
}

export function useRole() {
  const {
    props: {
      auth: {
        user
      }
    }
  } = usePage<SharedData>();

  return user?.user_role?.role;
}
