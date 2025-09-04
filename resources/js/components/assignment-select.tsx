import { createSelect } from './client-select';
import { Assignment } from '@/types';

export const AssignmentSelect = createSelect<Assignment>({
  api: '/api/v1/assignments',
  getKeywords: (item) => [
    item.reference_number ?? '',
    item.previous_reference_number ?? '',
    item.project?.title ?? '',
  ],
  getItemLabel: (item) => item.reference_number,
})
