import { FlashMessage } from '@/components/flash-message';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Link } from '@inertiajs/react';
import { Undo2Icon } from 'lucide-react';

const queryClient = new QueryClient();

export function BaseLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <div className={'fixed top-0 z-500 px-6 flex items-center justify-center gap-2 w-[100vw]'}>
      {
        auth.impersonating && (
          <>
            <div className={'z-10 h-[2px] bg-primary top-0 fixed w-full shadow-md'}></div>
            <div className={'z-10 rounded-b-sm px-2 text-xs py-1 bg-primary border-primary text-primary-foreground text-center'}>
              <Link className={'flex items-center gap-1'} href={route('leave-impersonation')}>
                <Undo2Icon className={'size-3'}/> Leave impersonation mode
              </Link>
            </div>
          </>
        )
      }
      </div>
      <div className={'flex flex-col min-h-screen'}>
        <Toaster/>
        <FlashMessage/>
        {children}
      </div>
    </QueryClientProvider>
  );
}
