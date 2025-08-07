import * as React from "react"

import { cn } from "@/lib/utils"
import { PropsWithChildren } from 'react';

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-background dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

function Inputs(props: PropsWithChildren) {
  return (
    <div className={'input-group *:not-first:-ml-[1px] *:not-last:rounded-r-none *:not-first:rounded-l-none flex *:focus:z-10'}>
      {props.children}
    </div>
  );
}

interface InputGroupProps {
  start?: React.ReactNode;
  end?: React.ReactNode;
  children?: React.ReactNode;
}
function InputGroup(props: InputGroupProps) {
  return (
    <div className={'flex relative'}>
      {props.children}
      {props.end && <span className={'-end-0 absolute'}>{props.end}</span>}
    </div>
  );
}

export { Input, Inputs, InputGroup }
