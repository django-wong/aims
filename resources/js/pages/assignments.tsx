import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/'
  },
  {
    title: 'Assignments',
    href: route('assignments')
  }
];
export default function Assignments() {
  return (
    <AppLayout breadcrumbs={breadcrumbs} pageAction={<Button>Add</Button>}>

    </AppLayout>
  );
}
