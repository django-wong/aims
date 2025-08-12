import { createSelect } from '@/components/client-select';
import { PurchaseOrder } from '@/types';

export const PurchaseOrderSelect = createSelect<PurchaseOrder>({
  api: '/api/v1/purchase-orders',
  getKeywords: (item) => [
    item.title,
    item.client?.business_name || '',
  ],
  getItemLabel: (item) => {
    // return (
    //   <span className={'w-full flex items-center gap-2'}>
    //     <span className={'flex-grow line-clamp-1'}>
    //       {item.title}
    //     </span>
    //     <Badge variant={'outline'} className={'shrink-0'}>{item.client ? `(${item.client.business_name})` : ''}</Badge>
    //   </span>
    // );

    return (
      item.title + (item.client ? ` (${item.client.business_name})` : '')
    )
  },
  searchParams: new URLSearchParams({
    sort: 'title',
    include: 'client'
  }),
});
