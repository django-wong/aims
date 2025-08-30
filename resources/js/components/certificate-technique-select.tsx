import { CertificateTechnique } from '@/types';
import { createSelect } from '@/components/client-select';

export const CertificateTechniqueSelect = createSelect<CertificateTechnique>({
  api: '/api/v1/certificate-techniques',
  getKeywords: (item) => [item.name],
  getItemLabel: (item) => item.name,
  searchParams: new URLSearchParams({
    sort: 'name',
  }),
});
