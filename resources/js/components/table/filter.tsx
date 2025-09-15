import { FunnelIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PropsWithChildren } from 'react';

interface TableFilterProps {
  children?: React.ReactNode;
}

export function TableFilter(props: TableFilterProps) {
  return (
    <>
      <div className={'flex justify-between gap-4 items-center'}>
        <div>{props.children}</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={'ghost'} className={'p-0'} size={'sm'}>
              <FunnelIcon className={'size-3'}/>
            </Button>
          </PopoverTrigger>
          <PopoverContent align={'end'} side={'bottom'} className={'w-80 grid'}>
            <FilterHeader>
              <FilterTitle>Client</FilterTitle>
              <FilterDescription>Filter by client name</FilterDescription>
            </FilterHeader>

            <FilterContent>
              <Input
                placeholder={
                  'Filter by client...'
                }
              />
            </FilterContent>

            <FilterFooter>
              <Button variant={'ghost'} size={'sm'}>Reset</Button> <Button size={'sm'}>Apply</Button>
            </FilterFooter>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}


export function FilterHeader(props: PropsWithChildren) {
  return (
    <div className={'grid gap-1 p-4'}>
      {props.children}
    </div>
  );
}

export function FilterTitle(props: PropsWithChildren) {
  return (
    <Label className={'leading-none font-bold'}>{props.children}</Label>
  );
}

export function FilterDescription(props: PropsWithChildren) {
  return (
    <div className={'text-muted-foreground text-sm'}>{props.children}</div>
  );
}

export function FilterContent(props: PropsWithChildren) {
  return (
    <div className={'grid gap-4 p-4 bg-muted/30 border-y'}>
      {props.children}
    </div>
  );
}

export function FilterFooter(props: PropsWithChildren) {
  return (
    <div className={'flex justify-end gap-2 p-4'}>
      {props.children}
    </div>
  );
}
