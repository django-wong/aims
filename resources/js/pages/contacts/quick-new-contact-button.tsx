import { ContactForm } from '@/pages/contacts/form';
import { Button } from '@/components/ui/button';
import { Contact } from '@/types';
import { useSelectContext } from '@/components/client-select';

export function QuickNewContactButton(props: { contactable_id?: number; contactable_type?: string }) {
  const context = useSelectContext<Contact>();

  function onSubmit(data: Contact) {
    if (context) {
      context.onValueChange(data.id);
      context.setOpen(false);
      context.setOpen(false);
      context.onDataChange?.(data);
      context.api.refetch();
    }
  }

  return (
    <>
      <ContactForm {...props} onSubmit={onSubmit}>
        <Button variant={'ghost'} size={'sm'} disabled={!props.contactable_id || !props.contactable_type}>
          Create New Contact
        </Button>
      </ContactForm>
    </>
  );
}
