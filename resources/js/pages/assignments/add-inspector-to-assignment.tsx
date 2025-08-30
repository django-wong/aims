import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Form, FormField } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { InspectorSelect } from '@/components/user-select';
import { AssignmentTypeSelect } from '@/components/assignment-type-select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { useState } from 'react';
import { useReactiveForm } from '@/hooks/use-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAssignment } from '@/providers/assignment-provider';
import { useTableApi } from '@/components/data-table-2';

export function AddInspectorToAssignment() {
  const [open, setOpen] = useState(false);

  const assignment = useAssignment();

  const table = useTableApi();

  const form = useReactiveForm<z.infer<typeof schema>>({
    url: '/api/v1/assignment-inspectors',
    defaultValues: {
      assignment_id: assignment?.id,
    },
    resolver: zodResolver(schema)
  });

  function save(close = false) {
    form.submit().then(() => {
      table.reload();
      if (close) {
        setOpen(false);
      } else {
        form.reset({
          ...form.getValues(),
          user_id: undefined,
          assignment_type_id: undefined,
        })
      }
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add Inspector</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Inspector to Assignment</DialogTitle>
            <DialogDescription className={'grid gap-2'}>
              Email notification will be send to inspector upon assignment.
            </DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            <Form {...form}>
              <div className={'grid grid-cols-12 gap-6'}>
                <FormField
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <VFormField label={'Inspector'} className={'col-span-6'}>
                        <InspectorSelect
                          onValueChane={() => {}}
                          onDataChange={(user) => {
                            field.onChange(user?.id || null);
                          }}
                          value={field.value}
                        />
                      </VFormField>
                    );
                  }}
                  name={'user_id'}
                />
                <FormField
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <VFormField label={'Discipline'} className={'col-span-6'}>
                        <AssignmentTypeSelect onValueChane={field.onChange} value={field.value} />
                      </VFormField>
                    );
                  }}
                  name={'assignment_type_id'}
                />

                <div className={'text-muted-foreground col-span-12 text-sm'}>
                  <Alert>
                    <InfoIcon />
                    <div>
                      <AlertTitle>Heads up!</AlertTitle>
                      <AlertDescription>Make sure you have configured the rate in Purchase Order for the Discipline you select.</AlertDescription>
                    </div>
                  </Alert>
                </div>
              </div>
            </Form>
          </DialogInnerContent>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'outline'}>Cancel</Button>
            </DialogClose>
            <Button onClick={() => save(false)}>Save</Button>
            <Button onClick={() => save(true)}>Save & Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const schema = z.object({
  assignment_id: z.number().min(1, { message: 'Assignment is required' }),
  user_id: z.number().min(1, { message: 'Inspector is required' }),
  assignment_type_id: z.number().min(1, { message: 'Discipline is required' }),
});
