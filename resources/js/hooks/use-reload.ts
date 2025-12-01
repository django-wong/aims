import { useTableApi } from '@/components/data-table-2';
import { router } from '@inertiajs/react';

export function useReload() {
  const table = useTableApi();
  return () => {
    if (table) {
      table.reload();
    } else {
      router.reload();
    }
  }
}
