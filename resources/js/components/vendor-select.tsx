import { Vendor } from '@/types';
import { createSelect } from '@/components/client-select';

export const VendorSelect = createSelect<Vendor>({
  api: '/api/v1/vendors',
  getKeywords: (item) => [
    item.name, item.business_name
  ],
  getItemLabel: (item) => item.name || item.business_name,
  searchParams: new URLSearchParams({
    sort: 'name'
  }),
})
