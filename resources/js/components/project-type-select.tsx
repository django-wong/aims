import { createSelect } from '@/components/client-select';
import { ProjectType } from '@/types';

export const ProjectTypeSelect = createSelect<ProjectType>({
  api: '/api/v1/project-types',
  getKeywords(item: ProjectType): string[] {
    return [item.name];
  },
  getItemLabel: (item) => {
    return item.name;
  }
})
