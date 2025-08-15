import { User } from '@/types';
import { createSelect } from '@/components/client-select';

export const StaffSelect = createSelect<User>({
  api: '/api/v1/users',
  getKeywords: (item) => [item.name, item.email],
  getItemLabel: (item) => item.name || item.email || 'Unknown User',
  searchParams: new URLSearchParams({
    'filter[role]': '8',
    'sort': 'name',
  })
});
