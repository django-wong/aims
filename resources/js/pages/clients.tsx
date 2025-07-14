import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/'
  },
  {
    title: 'Clients',
    href: '/clients'
  }
];

export default function Clients() {
  return (
    <>
      <Head title={'Clients'}/>
      <AppLayout breadcrumbs={breadcrumbs}>
        <div>
          <Button id={'new'}>Create New</Button>
        </div>
        This is clients page.
      </AppLayout>
    </>
  );
}
