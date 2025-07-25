import { createSelect } from './client-select';
import { AssignmentType } from '@/types';

export const AssignmentTypeSelect = createSelect<AssignmentType>({
  api: '/api/v1/assignment-types',
  getKeywords: (item) => [item.name],
  getItemLabel: (item) => item.name,
})
