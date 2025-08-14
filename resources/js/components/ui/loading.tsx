import { LoaderCircle } from 'lucide-react';

export function Loading(props: {show: boolean}) {
  return props.show ? <LoaderCircle className={'animate-spin size-4'} /> : null;
}
