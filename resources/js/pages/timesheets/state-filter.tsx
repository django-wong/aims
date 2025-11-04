import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTableApi } from '@/components/data-table-2';

export function StateFilter() {
  const table = useTableApi();

  return (
    <Tabs value={table.searchParams.get('filter[view]') ?? 'default'} onValueChange={(value) => {
      table.setSearchParams((params) => {
        if (value) {
          params.set('filter[view]', value);
        } else {
          params.delete('filter[view]');
        }
        return params;
      })
    }}>
      <TabsList>
        <TabsTrigger value={'default'}>Default</TabsTrigger>
        <TabsTrigger value={'open'}>Open</TabsTrigger>
        <TabsTrigger value={'all'}>All</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
