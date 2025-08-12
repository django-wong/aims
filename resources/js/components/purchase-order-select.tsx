import { createSelect } from '@/components/client-select';
import { PurchaseOrder } from '@/types';

export const PurchaseOrderSelect = createSelect<PurchaseOrder>({
  api: '/api/v1/purchase-orders',
  getKeywords: (item) => [
    item.title,
    item.client?.business_name || '',
    item.client?.user?.name || '',
  ],
  getItemLabel: (item) => item.title || 'Unknown Purchase Order',
  searchParams: new URLSearchParams({
    sort: 'title',
    include: 'client,client.user'
  }),
});
