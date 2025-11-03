import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTableApi } from '@/components/data-table-2';
import { PropsWithChildren } from 'react';

export function ShowAllSwitch(props: PropsWithChildren) {
  const table = useTableApi();
  return (
    <Label>
      <Switch checked={table.searchParams.get('filter[all]') === '1'} onCheckedChange={(value) => {
        table.setSearchParams((params) => {
          params.set('filter[all]', value ? '1' : '0');
          return params;
        });
      }}/> {props.children ?? 'Show All'}
    </Label>
  );
}
