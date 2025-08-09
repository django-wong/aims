import { SvgBg } from '@/components/svg-bg';
import { PropsWithChildren } from 'react';
import { PackageOpen } from 'lucide-react';

export function Empty(props: PropsWithChildren) {
  return (
    <div className={'h-32 relative text-muted-foreground rounded-lg flex items-center justify-center'}>
      <div className={'absolute inset-0 overflow-hidden opacity-10'}>
        <SvgBg/>
      </div>
      <div className={'flex flex-col items-center justify-center gap-2 text-center'}>
        <PackageOpen/>
        { props.children || (
          <p className={'px-4'}>
            No record yet.
          </p>
        )}
      </div>
    </div>
  );
}
