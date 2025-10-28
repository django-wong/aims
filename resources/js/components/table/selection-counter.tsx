import { useTableApi } from '@/components/data-table-2';

export function SelectionCounter() {
  const table = useTableApi();
  if (table.selections.length > 0) {
    return `(${table.selections.length})`;
  }
  return null;
}
