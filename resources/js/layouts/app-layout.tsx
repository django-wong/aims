import AppLayoutTemplate, { AppSidebarLayoutProps } from '@/layouts/app/app-sidebar-layout';
import { FlashMessage } from '@/components/flash-message';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface AppLayoutProps extends AppSidebarLayoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
  <QueryClientProvider client={queryClient}>
    <Toaster/>
    <FlashMessage/>
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
      {children}
    </AppLayoutTemplate>
  </QueryClientProvider>
);
