import { Spinner } from '@/components/ui/spinner';

export function Loading(props: {show: boolean}) {
  return props.show ? <Spinner/> : null;
}
