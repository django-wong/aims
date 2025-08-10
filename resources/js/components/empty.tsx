import { SvgBg } from '@/components/svg-bg';
import { ComponentProps } from 'react';
import { PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Empty({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('min-h-[300px] w-full relative rounded-lg flex items-center justify-center', className)} {...props}>
      <div className={'absolute inset-0 overflow-hidden opacity-5'}>
        <SvgBg/>
      </div>
      <div className={'flex flex-col items-center justify-center gap-2 text-center'}>
        <PackageOpen/>
        { children || (
          <p className={'px-4'}>
            No record yet.
          </p>
        )}
      </div>
    </div>
  );
}
