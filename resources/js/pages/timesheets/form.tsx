import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DialogFormProps, Timesheet, Assignment } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const timesheetSchema = z.object({
  assignment_id: z.number(),
  hours: z.number().min(0, 'Hours must be 0 or greater'),
  km_traveled: z.number().min(0, 'KM traveled must be 0 or greater'),
});

type TimesheetFormData = z.infer<typeof timesheetSchema>;

export function TimesheetForm({
  children,
  onSubmit,
  value,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: DialogFormProps<Timesheet>) {
  const [open, setOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? (controlledOnOpenChange || (() => {})) : setOpen;

  const form = useForm<TimesheetFormData>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: {
      assignment_id: value?.assignment_id || 0,
      hours: value?.hours || 0,
      km_traveled: value?.km_traveled || 0,
    },
  });

  // Fetch assignments for the dropdown
  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const response = await fetch('/api/v1/assignments?include=project,project.client&per_page=100');
      const data = await response.json();
      return data.data as Assignment[];
    },
  });

  const handleSubmit = async (data: TimesheetFormData) => {
    try {
      const url = value ? `/api/v1/timesheets/${value.id}` : '/api/v1/timesheets';
      const method = value ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        onSubmit(result);
        setIsOpen(false);
        form.reset();
      } else {
        console.error('Failed to save timesheet');
      }
    } catch (error) {
      console.error('Error saving timesheet:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {value ? 'Edit Timesheet' : 'Create New Timesheet'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="assignment_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an assignment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assignmentsLoading ? (
                        <SelectItem value="loading" disabled>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading assignments...
                        </SelectItem>
                      ) : (
                        assignments?.map((assignment) => (
                          <SelectItem key={assignment.id} value={assignment.id.toString()}>
                            {assignment.project?.title || `Assignment #${assignment.id}`}
                            {assignment.project?.client && (
                              <span className="text-muted-foreground ml-2">
                                - {assignment.project.client.business_name}
                              </span>
                            )}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="km_traveled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kilometers Traveled</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {value ? 'Update' : 'Create'} Timesheet
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
