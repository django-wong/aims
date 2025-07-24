import { createSelect } from '@/components/client-select';
import { Org } from '@/types';

export const OrgSelect = createSelect<Org>({
  api: '/api/v1/orgs',
  getKeywords: (item) => [item.name],
  getItemLabel: (item) => item.name || 'Unknown Organization',
  searchParams: new URLSearchParams({
    sort: 'name'
  }),
})
