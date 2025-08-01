import { CircleCheck } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function captured() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-grow flex-col items-center justify-center p-4 text-center md:p-6">
          <CircleCheck className="h-16 w-16 stroke-green-500" />
          <h1 className="mt-4 text-2xl font-semibold">Submit Successful</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Thank you for your hardworking. Your timesheet has been captured successfully.</p>
          <Link
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              window.history.back();
            }}
            className="bg-primary text-primary-foreground mt-6 inline-flex h-8 items-center justify-center rounded-md px-4 text-sm font-medium"
            prefetch={false}
            href={''}
          >
            Return to previous page
          </Link>
        </main>
        <footer className="flex h-14 items-center justify-center border-t">
          <p className="text-sm text-gray-500 dark:text-gray-400">&copy; 2025 BIE Group. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
