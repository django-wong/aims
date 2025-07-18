import { cn } from '@/lib/utils';
import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as React from 'react';

export function FlatTabs(props: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root
    data-slot="tabs"
    {...props}
  />
}

export function FlatLinkTabs(props: Omit<React.ComponentProps<typeof FlatTabs>, 'value'>) {
  return (
    <FlatTabs
      data-slot="link-tabs"
      {...props}
      value={window.location.origin + window.location.pathname}
    />
  )
}

export function FlatTabList({className, ...props}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "text-muted-foreground w-full inline-flex items-center justify-start gap-6 border-b border-sidebar-border/50 mb-8",
        className
      )}
      {...props}
    />
  );
}

export function FlatTabTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "-mb-[3px] dark:data-[state=active]:text-foreground text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 py-1 text-md whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:font-bold data-[state=active]:border-b data-[state=active]:border-primary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

export function FlatLinkTabTrigger(props: Omit<React.ComponentProps<typeof FlatTabTrigger>, 'value'> & {route: string}) {
  return (
    <FlatTabTrigger
      {...props}
      value={props.route}
    />
  );
}
