import AppLayout from '@/layouts/app-layout';

export default function NotFound() {
  return (
    <AppLayout>
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">404</h1>
          <p className="mt-2 text-gray-600">Page Not Found</p>
          <a href="/" className="mt-4 inline-block px-2 py-1 rounded bg-primary text-white transition-colors text-sm">
            Go to Home
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
