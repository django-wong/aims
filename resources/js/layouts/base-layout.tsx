import { FlashMessage } from '@/components/flash-message';
import { Toaster } from '@/components/ui/sonner';

export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <FlashMessage>
        {children}
      </FlashMessage>
      <Toaster/>
    </div>
  );
}
