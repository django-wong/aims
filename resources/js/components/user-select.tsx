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


export const InspectorSelect = createSelect<User>({
  api: '/api/v1/users',
  getKeywords: (item) => [item.name, item.email],
  getItemLabel: (item) => item.name || item.email || 'Unknown User',
  searchParams: new URLSearchParams({
    'filter[role]': '5',
    'sort': 'name',
  })
});

export const UserSelect = createSelect<User>({
  api: '/api/v1/users',
  getKeywords: (item) => [item.name, item.email],
  getItemLabel: (item) => item.name || item.email || 'Unknown User',
  searchParams: new URLSearchParams({
    'sort': 'name',
  })
});
