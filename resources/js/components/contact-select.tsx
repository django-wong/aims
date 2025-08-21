import { createSelect } from '@/components/client-select';
import { Contact } from '@/types';

export const ContactSelect = createSelect<Contact>({
  api: '/api/v1/contacts',
  getKeywords: (item) => [
    `${item.first_name} ${item.last_name} ${item.email} ${item.phone} ${item.company}`.toLowerCase(),
  ],
  getItemLabel: (item) => item.name || 'Unknown',
  searchParams: new URLSearchParams({
    sort: 'name'
  }),
})
