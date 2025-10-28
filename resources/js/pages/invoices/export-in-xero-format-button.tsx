import { Button } from '@/components/ui/button';
import { PaperclipIcon } from 'lucide-react';
import { SelectionCounter } from '@/components/table/selection-counter';

import { useTableApi } from '@/components/data-table-2';

export function ExportInXeroFormatButton() {
  const table = useTableApi();

  function exportAsXero() {
    const url = table.getUrl();
    url.searchParams.set('export', 'xero');
    if (table.selections.length > 0) {
      url.searchParams.set('filter[selection]', table.selections.join('|'));
    }
    window.open(url.toString(), '_blank');
  }

  return (
    <Button onClick={exportAsXero} variant={'outline'}>
      <PaperclipIcon/> Export as Xero <SelectionCounter/>
    </Button>
  );
}
