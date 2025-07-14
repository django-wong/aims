import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cellVariant = cva('', {
  variants: {
    variant: {
      header: 'font-bold text-xs dark:text-gray-400 font-semibold tracking-wider',
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
export default function TableCellWrapper({
                                           children,
                                           last,
                                           variant,
  center,
                                           ...props
                                         }: React.ComponentProps<'div'> & VariantProps<typeof cellVariant> & {
  children?: React.ReactNode
}) {
  return <div className={cn(cellVariant({ last, variant, center }))} {...props}>
    {children}
  </div>;
}

export { cellVariant };
