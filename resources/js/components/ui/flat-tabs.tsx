import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';
import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as React from 'react';

export function FlatTabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root
    data-slot="tabs"
    className={cn("border-b border-sidebar-border/50", className)}
    {...props}
  />
}

export function FlatTabList({className, ...props}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg gap-6",
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
        "-mb-[2px] dark:data-[state=active]:text-foreground text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 py-1 text-sm whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:font-bold data-[state=active]:border-b data-[state=active]:border-primary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}
