import { ChevronDown, ChevronUp } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';

interface SortButtonProps {
  value: 'asc' | 'desc' | null | undefined;
  onSortChange: (direction: 'asc' | 'desc' | null) => void
}

export function SortButton(props: PropsWithChildren<SortButtonProps>) {
  function nextDirection() {
    if (props.value === 'asc') {
      return 'desc';
    } else if (props.value === 'desc') {
      return null;
    } else {
      return 'asc';
    }
  }

  function onClick() {
    props.onSortChange(nextDirection())
  }
  return (
    <Button variant={'ghost'} className={'flex items-center gap-2'} onClick={onClick}>
      {props.children}
      <div className={'flex items-center gap-1'}>
        <ChevronUp
          size={14}
          className={
            props.value === 'asc'  ? 'text-black' : 'text-gray-400'
          }
        />
        <ChevronDown
          size={14}
          className={
            props.value === 'desc' ? 'text-black' : 'text-gray-400'
          }
        />
      </div>
    </Button>
  )
}
