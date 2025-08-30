import { CertificateType } from '@/types';
import { createSelect } from '@/components/client-select';

export const CertificateTypeSelect = createSelect<CertificateType>({
  api: '/api/v1/certificate-types',
  getKeywords: (item) => [item.name],
  getItemLabel: (item) => item.name,
  searchParams: new URLSearchParams({
    sort: 'name',
  }),
});
