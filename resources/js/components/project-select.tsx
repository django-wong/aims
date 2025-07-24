import { createSelect } from '@/components/client-select';
import { Project } from '@/types';

export const ProjectSelect = createSelect<Project>({
  api: '/api/v1/projects',
  getKeywords: (item) => [
    item.title,
  ],
  getItemLabel: (item) => item.title || 'Unknown Project',
  searchParams: new URLSearchParams({
    sort: 'title'
  }),
})
