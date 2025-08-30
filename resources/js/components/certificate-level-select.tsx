import { CertificateLevel } from '@/types';
import { createSelect } from '@/components/client-select';

export const CertificateLevelSelect = createSelect<CertificateLevel>({
  api: '/api/v1/certificate-levels',
  getKeywords: (item) => [item.name],
  getItemLabel: (item) => item.name,
  searchParams: new URLSearchParams({
    sort: 'name',
  }),
});
