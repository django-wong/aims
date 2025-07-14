import AppLayout from '@/layouts/app-layout';

export default function NotFound() {
  return (
    <AppLayout>
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">404</h1>
          <p className="mt-2 text-gray-600">
            The page you are looking for does not exist. <a href="/" className="inline-block text-primary transition-colors text-sm">Go to Home</a>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
