import { Button } from '@/components/ui/button';
import { DialogWrapper } from '@/components/dialog-wrapper';
import { UserForm } from '@/pages/users/form';
import { User, UserRoleEnum } from '@/types';
import { useSelectContext } from '@/components/client-select';

export function QuickNewStaffButton() {

  const context = useSelectContext<User>();

  function onSubmit(data: User) {
    context?.api.refetch();
    context?.onValueChange(data.id);
    context?.onDataChange?.(data);
    context?.setOpen(false);
  }

  return (
    <>
      <UserForm
        role={UserRoleEnum.Staff}
        onSubmit={onSubmit}>
        <Button variant={'ghost'} size={'sm'} className={'link'}>Create New One</Button>
      </UserForm>
    </>
  );
}
