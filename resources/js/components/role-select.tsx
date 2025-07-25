import { SelectPopup, SelectPopupProps, SelectProps } from '@/components/client-select';
import { Model } from '@/types';
import { useState } from 'react';

interface Role extends Model {
  name: string;
}

const roles: Array<Role> = [{
  id: 2,
  name: 'Organization Admin',
}, {
  id: 3,
  name: 'Finance',
}, {
  id: 4,
  name: 'PM',
}, {
  id: 5,
  name: 'Inspector',
}, {
  id: 8,
  name: 'Staff',
}];

export function RoleSelect(props: SelectProps<Role>) {
  const [open, setOpen] = useState<boolean>(false);
  return <SelectPopup
    data={roles}
    open={open}
    setOpen={setOpen}
    getItemLabel={(item) => item.name}
    getKeywords={(item) => [item.name]}
    {...props}
  />
}
