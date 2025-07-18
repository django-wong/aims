import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';
import { Column, ColumnDef } from '@tanstack/react-table';

const cellVariant = cva('', {
  variants: {
    variant: {
      header: 'font-bold text-xs dark:text-gray-400 font-semibold tracking-wider uppercase',
      body: ''
    },
    last: {
      false: null,
      true: 'text-right'
    },
    center: {
      false: null,
      true: 'text-center'
    }
  },
  defaultVariants: {
    last: false,
    variant: 'body'
  }
});

type TableCellWrapperProps = PropsWithChildren<React.ComponentProps<'div'> & VariantProps<typeof cellVariant>> & {
  def: Column<any>
}

function computedStyle(def: Column<any>): React.CSSProperties {
  const isPined = def.getIsPinned();
  console.info([isPined, def.id]);
  return {
    position: isPined ? 'sticky' : 'relative',
    opacity: isPined ? 0.8 : 1,
    left: isPined ? def.getStart('left') + 'px' : 'initial',
    right: isPined ? def.getStart('right') + 'px' : 'initial',
    // width: def.getSize() + 'px',
    zIndex: isPined ? 1 : 0
  };
}

export default function TableCellWrapper({ def, children, last, variant, center, ...props }: TableCellWrapperProps) {
  return <div style={computedStyle(def)} className={cn(cellVariant({ last, variant, center }))} {...props}>
    {children}
  </div>;
}

export { cellVariant };
