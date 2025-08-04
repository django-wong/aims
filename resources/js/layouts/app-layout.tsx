import AppLayoutTemplate, { AppSidebarLayoutProps } from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { FlashMessage } from '@/components/flash-message';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface AppLayoutProps extends AppSidebarLayoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
  <QueryClientProvider client={queryClient}>
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
      <FlashMessage>
        {children}
      </FlashMessage>
    </AppLayoutTemplate>
    <Toaster/>
  </QueryClientProvider>
);
