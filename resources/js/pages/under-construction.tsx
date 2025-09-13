import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';


export default function UnderConstruction(props: {title: string}) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/'
    },
    {
      title: props.title ?? 'Under Construction',
      href: '.'
    }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={props.title ?? 'Under Construction'} />
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 rounded-xl p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            🚧<br/>
            Under Construction
          </h1>
          <p className="mt-2 text-gray-600">
            The page you are looking for is currently under construction.&nbsp;
            <a href="/" className="text-primary inline-block text-sm transition-colors">
              Go to Home
            </a>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
