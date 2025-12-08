import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import SettingsLayout from '@/layouts/settings/layout';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem } from '@/types';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Settings',
    href: '/settings',
  },
  {
    title: 'API Key',
    href: '/settings/api-key',
  }
]
export default function ApiKey() {

  function generate() {
    axios.post('/api/v1/users/api-key/generate').then((response) => {
      if (response) {
        console.info(response);
      }
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Billing" />
      <SettingsLayout>
        <div className="space-y-6">
          <Button onClick={generate}>Generate New API Key</Button>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
