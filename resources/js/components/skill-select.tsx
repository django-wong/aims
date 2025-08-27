import { Skill } from '@/types';
import { createSelect } from '@/components/client-select';
import { Badge } from '@/components/ui/badge';

export const SkillSelect = createSelect<Skill>({
  api: '/api/v1/skills',
  getKeywords: (item) => [item.code, item.description || '', item.report_code || ''],
  getItemLabel: (item) => {
    return (
      <div className={'flex items-center justify-between gap-2'}>
        <span title={item.description || ''} className={'flex-grow line-clamp-1 overflow-hidden'}>{item.description}</span>
        <Badge variant={'secondary'}>{item.code}</Badge>
      </div>
    );
  },
  searchParams: new URLSearchParams({
    sort: 'sort',
  }),
});
