import { FlashMessage } from '@/components/flash-message';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={'flex flex-col min-h-screen'}>
        <Toaster/>
        <FlashMessage/>
        {children}
      </div>
    </QueryClientProvider>
  );
}
