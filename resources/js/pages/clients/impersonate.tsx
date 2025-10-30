import { Button } from '@/components/ui/button';
import { useRole } from '@/hooks/use-role';
import { UserRoleEnum } from '@/types';
import { LogInIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';

export function Impersonate(props: { userId: number }) {
  const role = useRole();

  if ([UserRoleEnum.Admin].indexOf(role as any) === -1) {
    return null;
  }

  return (
    <Link href={route('impersonate', props.userId)}>
      <Button variant={'outline'}>
        <LogInIcon/>
        Impersonate
      </Button>
    </Link>
  );
}
