import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { useQuote } from '@/providers/quote-provider';
import { PopoverConfirm } from '@/components/popover-confirm';
import axios from 'axios';
import { useTableApi } from '@/components/data-table-2';
import { router } from '@inertiajs/react';

export function QuoteActions() {
  const quote = useQuote();
  const table = useTableApi();

  function destroy() {
    axios.delete('/api/v1/quotes/' + quote?.id).then(() => {
      if (table) {
        table.reload()
      } else {
        router.reload();
      }
    });
  }

  return (
    <div className={'flex gap-2'}>
      <PopoverConfirm asChild message={'Are you sure to delete this quote?'} onConfirm={destroy} side={'bottom'} align={'end'}>
        <Button variant={'secondary'} size={'sm'}>
          <TrashIcon/>
        </Button>
      </PopoverConfirm>
    </div>
  );
}
