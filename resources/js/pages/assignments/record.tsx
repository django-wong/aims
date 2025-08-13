import { Comments } from '@/components/comments';
import { DataTable } from '@/components/data-table-2';
import { DatePicker } from '@/components/date-picker';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Info, InfoHead, InfoLine } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Badge } from '@/components/ui/badge';
import { Button, Loading } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input, Inputs } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VFormField } from '@/components/vform';
import { objectToFormData, useReactiveForm } from '@/hooks/use-form';
import { useTable } from '@/hooks/use-table';
import { BaseLayout } from '@/layouts/base-layout';
import { Assignment, SharedData, Timesheet, TimesheetItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Document from '@tiptap/extension-document';
import Dropcursor from '@tiptap/extension-dropcursor';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import { TableKit } from '@tiptap/extension-table';
import Text from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';
import { UndoRedo } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import dayjs from 'dayjs';
import {
  BetweenHorizonalEndIcon,
  BetweenHorizonalStartIcon,
  BetweenVerticalEndIcon,
  BetweenVerticalStartIcon,
  BoldIcon,
  BookmarkCheck,
  ClockIcon,
  FileBadgeIcon,
  FoldHorizontalIcon,
  FoldVerticalIcon,
  HeadingIcon,
  House,
  MessageCircleIcon,
  PaperclipIcon,
  Plus,
  Table2,
  UploadIcon,
  UserCircle,
} from 'lucide-react';
import { PropsWithChildren, startTransition, useState } from 'react';
import zod, { z } from 'zod';
import { useQueryParam } from '@/hooks/use-query-param';

interface RecordProps {
  assignment: Assignment;
  timesheet?: Timesheet;
}

export default function Record(props: RecordProps) {
  const page = usePage<SharedData>();

  const [hash, setHash] = useQueryParam('tab', 'timesheet');

  return (
    <BaseLayout>
      <Head title={props.assignment.project?.title} />
      <div className={'flex flex-1 flex-col w-full '}>
        <>
          <>
            <div className={'p-6 py-8'}>
              <div>
                <div className={'mb-4 flex items-center justify-between'}>
                  <div className={'-ml-3 flex items-center gap-2 text-3xl font-bold'}>
                    <BookmarkCheck className={'h-16 w-16'} />
                  </div>
                  <div className={'hidden gap-4 sm:flex'}>
                    <Button variant={'outline'}>
                      <span className={'hidden md:inline'}>{page.props.auth.user?.name}</span>
                      <UserCircle />
                    </Button>
                  </div>
                </div>
              </div>
              <div className={'flex flex-col gap-4'}>
                <h1 className={'text-xl font-bold'}>{props.assignment.project?.title}</h1>
                <div className={'flex justify-start'}>
                  <div className={'flex items-center justify-start gap-2 rounded-lg border px-2 py-1 text-sm'}>
                    <House className={'w-4'} />
                    {(props.assignment.operation_org || props.assignment.org)?.name ?? 'Org Name'}
                  </div>
                </div>
              </div>
            </div>
            <TwoColumnLayout73
              className={'relative'}
              right={
                <Info>
                  <InfoHead>Details</InfoHead>
                  <div>
                    <InfoLine label={'Client Name'}>{props.assignment.project?.client?.business_name}</InfoLine>
                    <InfoLine label={'Project'}>{props.assignment.project?.title}</InfoLine>
                    <InfoLine label={'Assignment Type'}>
                      <Badge>{props.assignment.assignment_type?.name}</Badge>
                    </InfoLine>
                  </div>
                </Info>
              }
              left={
                <Tabs value={hash} onValueChange={setHash} className={'h-full gap-4'}>
                    <TabsList>
                      <TabsTrigger value={'timesheet'}>
                        <ClockIcon />
                        <span className={'hidden sm:inline'}>Timesheet</span>
                      </TabsTrigger>
                      <TabsTrigger value={'report'}>
                        <FileBadgeIcon />
                        <span className={'hidden sm:inline'}>Report</span>
                      </TabsTrigger>
                      <TabsTrigger value={'comments'}>
                        <MessageCircleIcon />
                        <span className={'hidden sm:inline'}>Comments</span>
                      </TabsTrigger>
                      <TabsTrigger value={'attachments'}>
                        <PaperclipIcon />
                        <span className={'hidden sm:inline'}>Attachments</span>
                      </TabsTrigger>
                    </TabsList>
                    <Info className={'relative flex flex-1 flex-col'}>
                      <TabsContent value={'timesheet'} className={'relative flex flex-1 flex-col gap-4'}>
                        <TimesheetItems
                          timesheet={props.timesheet}
                          assignment={props.assignment}
                        />
                      </TabsContent>
                      <TabsContent value={'report'}>
                        <div className={'grid gap-4'}>
                          <div className={'bg-background overflow-hidden rounded-lg border'}>
                            <Editor />
                          </div>
                          <div className={'flex items-center justify-end gap-2 '}>
                            <Button>Save</Button>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value={'attachments'}>
                        <div className={'bg-background overflow-hidden rounded-lg border'}>
                          <Attachments />
                        </div>
                      </TabsContent>
                      <TabsContent value={'comments'}>
                        <Comments commentableType={'Assignment'} commentableId={props.assignment.id} />
                      </TabsContent>
                    </Info>
                  </Tabs>
              }
            />
          </>
        </>
      </div>
    </BaseLayout>
  );
}

function Editor() {
  const [showTableOptions, setShowTableOptions] = useState(false);
  const editor = useEditor({
    onSelectionUpdate: ({ editor, ...props }) => {
      const { selection } = editor.state;
      console.info(selection);
      console.info(editor, props);
      console.info(selection.$anchor.end());
      for (let i = selection.$anchor.depth; i >= 0; i--) {
        const node = selection.$anchor.node(i);
        if (node.type.name === 'table') {
          setShowTableOptions(true);
          console.info(editor.$pos(selection.$anchor.pos));
          return;
        }
      }
      setShowTableOptions(false);
    },
    extensions: [
      Document,
      Text,
      Heading,
      Dropcursor,
      Image,
      Paragraph,
      HardBreak,
      Bold,
      Italic,
      Strike,
      Underline,
      Link,
      Code,
      CodeBlock,
      Blockquote,
      BulletList,
      OrderedList,
      ListItem,
      TableKit.configure({
        table: {
          resizable: true,
          HTMLAttributes: {
            class: 'w-full',
          },
        },
      }),
      UndoRedo,
    ],
    content: `
      <h4><strong>(1.0) Summary</strong></h4>
      <p>
        ACTIONS REQUIRED / QUERIES <br>
        This section must include all details of any raised NCR's, actions not completed by the Vendor and questions regarding any unclear requirements with regards to Purchase Orders and specifications.
      </p>
      <h4><strong>(2.0) Specifications and Drawings</strong></h4>
      <table>
        <thead>
          <tr>
            <th colwidth="190">Document No.</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td></td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
          </tr>
          <tr>
            <td>3</td>
            <td></td>
          </tr>
          <tr>
            <td>...</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <h4><strong>(3.0) Health and Safety</strong></h4>
      <p></p>
      <h4><strong>(4.0) Materials</strong></h4>
      <p></p>
      <h4><strong>(5.0) Visual and Dimensional Examination</strong></h4>
      <p></p>
      <h4><strong>(6.0) Functional and Performance Tests</strong></h4>
      <p></p>
      <h4><strong>(7.0) Special Processes</strong></h4>
      <p></p>
      <h4><strong>(8.0) Preservation, Packing and Shipping Marks</strong></h4>
      <p></p>
      <h4><strong>(9.0) Documentation</strong></h4>
      <p></p>
      <h4><strong>(10.0) Release / Non-Conformance</strong></h4>
      <p></p>
      <h4><strong>(11.0) List of Attachment></h4>
      <p></p>
    `,
  });
  return (
    <>
      <div className={'bg-background sticky top-0 left-1 z-50 flex flex-wrap gap-2 border-b px-6 py-1 *:border-r *:last:border-r-0'}>
        <Inputs>
          <Button variant={'ghost'} size={'icon'}>
            <HeadingIcon />
          </Button>
          <Button variant={'ghost'} size={'icon'}>
            <BoldIcon />
          </Button>
        </Inputs>
        {showTableOptions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} size={'icon'}>
                <Table2 />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={'w-56'} align={'start'} side={'bottom'}>
              <DropdownMenuLabel>Table</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
                  Add column before
                  <DropdownMenuShortcut>
                    <BetweenHorizonalStartIcon />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
                  Add column after
                  <DropdownMenuShortcut>
                    <BetweenHorizonalEndIcon />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
                  Add row before
                  <DropdownMenuShortcut>
                    <BetweenVerticalStartIcon />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
                  Add row after
                  <DropdownMenuShortcut>
                    <BetweenVerticalEndIcon />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>
                  Remove column
                  <DropdownMenuShortcut>
                    <FoldHorizontalIcon />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>
                  Delete row
                  <DropdownMenuShortcut>
                    <FoldVerticalIcon />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className={'prose prose-td:p-2 prose-th:p-2 prose-table:border prose-td:border prose-th:border prose-td:*:p-0 max-w-full!'}>
        <EditorContent editor={editor} className={'*:px-6 *:outline-0'} />
      </div>
      <FloatingMenu editor={editor}></FloatingMenu>
      <BubbleMenu editor={editor} />
    </>
  );
}

interface TimesheetItemFormProps {
  assignment: Assignment;
  onSubmit?: (data: TimesheetItem) => void;
}

const attachments = z
  .array(z.instanceof(File).refine((file) => file.size < 524288000, 'File size must be less than 500MB'))
  .max(5, 'You can only upload up to 5 files')
  .optional();

const number = zod.coerce.number().min(0).optional();

const timesheetItemSchema = zod.object({
  assignment_id: zod.coerce.number(),
  date: zod
    .date()
    .or(zod.string())
    .transform((value) => {
      return dayjs(value).format('YYYY/MM/DD');
    }),
  work_hours: number,
  travel_hours: number,
  report_hours: number,
  days: number,
  overnights: number,
  travel_distance: number,
  travel_rate: number,
  hotel: number,
  rail_or_airfare: number,
  meals: number,

  attachments: attachments,
});

type Record = zod.infer<typeof timesheetItemSchema>;

function TimesheetItemForm(props: PropsWithChildren<TimesheetItemFormProps>) {
  const form = useReactiveForm<Record>({
    url: '/api/v1/timesheet-items',
    resolver: zodResolver(timesheetItemSchema) as any,
    defaultValues: {
      assignment_id: props.assignment.id,
      date: new Date().toISOString(),
    },
    serialize: (data) => {
      return objectToFormData(data);
    },
  });

  const [open, setOpen] = useState(false);

  async function save() {
    form.submit().then(() => {
      startTransition(() => {
        form.reset();
        setOpen(false);
        router.reload();
      });
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Timesheet</DialogTitle>
            <DialogDescription>Please be sure to fill in correctly the timesheet for this assignment.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            <div className={'grid grid-cols-12 gap-4'}>
              <Form {...form}>
                <div className={'col-span-12 md:col-span-6'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <>
                          <VFormField required label={'Date'}>
                            <DatePicker value={field.value} onChange={(date) => field.onChange(date)} />
                          </VFormField>
                        </>
                      );
                    }}
                    name={'date'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-6'}>
                  <div>
                    <div className={'grid grid-cols-12 gap-4'}>
                      <div className={'col-span-6'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <>
                                <VFormField label={'Days'}>
                                  <Input placeholder={'Day'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                </VFormField>
                              </>
                            );
                          }}
                          name={'days'}
                        />
                      </div>
                      <div className={'col-span-6'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <>
                                <VFormField label={'Overnights'}>
                                  <Input placeholder={'Overnight'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                </VFormField>
                              </>
                            );
                          }}
                          name={'overnights'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <>
                          <VFormField label={'Work Hours'}>
                            <Input min={0} type={'number'} value={field.value} onChange={field.onChange} />
                          </VFormField>
                        </>
                      );
                    }}
                    name={'work_hours'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <>
                          <VFormField label={'Travel Hours'}>
                            <Input min={0} type={'number'} value={field.value} onChange={field.onChange} />
                          </VFormField>
                        </>
                      );
                    }}
                    name={'travel_hours'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <>
                          <VFormField label={'Remote Hours'}>
                            <Input min={0} type={'number'} value={field.value} onChange={field.onChange} />
                          </VFormField>
                        </>
                      );
                    }}
                    name={'report_hours'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-8'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <>
                          <VFormField label={'Mileage'}>
                            <Input placeholder={'KM/Mileage'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                          </VFormField>
                        </>
                      );
                    }}
                    name={'travel_distance'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <>
                          <VFormField label={'Travel Rate'}>
                            <Input placeholder={'$'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                          </VFormField>
                        </>
                      );
                    }}
                    name={'travel_rate'}
                  />
                </div>
                <div className={'col-span-12'}>
                  <FormItem>
                    <Label>Additional Expenses</Label>
                    <div className={'grid grid-cols-12 gap-4'}>
                      <div className={'col-span-12 md:col-span-4'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <VFormField label={'Hotel'}>
                                <Input placeholder={'$'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                              </VFormField>
                            );
                          }}
                          name={'hotel'}
                        />
                      </div>
                      <div className={'col-span-12 md:col-span-4'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <VFormField label={'Rail/Airfare'}>
                                <Input placeholder={'$'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                              </VFormField>
                            );
                          }}
                          name={'rail_or_airfare'}
                        />
                      </div>
                      <div className={'col-span-12 md:col-span-4'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <VFormField label={'Meals'}>
                                <Input placeholder={'$'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                              </VFormField>
                            );
                          }}
                          name={'meals'}
                        />
                      </div>
                    </div>
                  </FormItem>
                </div>
                <div className={'col-span-12 md:col-span-12'}>
                  <div
                  // label={'Attachments'}
                  // for={'attachments'}
                  // error={form.formState.errors.attachments?.message}
                  >
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <>
                            <FormItem>
                              <FormLabel>Attachments</FormLabel>
                              <div
                                className={'bg-background dark:bg-input/30 flex flex-col items-center justify-center gap-2 rounded-lg border p-16'}>
                                <UploadIcon />
                                <FormControl>
                                  <Button asChild variant={'outline'} className={'cursor-pointer'}>
                                    <label>
                                      <input
                                        multiple
                                        type={'file'}
                                        accept={'*'}
                                        className={'hidden'}
                                        onChange={(event) => {
                                          console.info(event);
                                          field.onChange(Array.from(event.target.files ?? []));
                                        }}
                                      />
                                      <span className={'flex items-center gap-2'}>
                                        <Plus />
                                        Add Attachments
                                      </span>
                                    </label>
                                  </Button>
                                </FormControl>
                              </div>
                            </FormItem>
                          </>
                        );
                      }}
                      name={'attachments'}
                    />
                    <div className={'mt-2'}>
                      {form.watch('attachments')?.length ? (
                        <div className={'flex flex-col gap-2'}>
                          {(form.watch('attachments') || []).map((file, index) => (
                            <p key={index} className={'text-muted-foreground flex-grow text-sm'}>
                              {file.name}
                            </p>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </DialogInnerContent>
          <DialogFooter>
            <Button disabled={form.submitDisabled || form.formState.isSubmitting} onClick={save}>
              <Loading show={form.formState.isSubmitting} />
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const attachmentsSchema = zod.object({
  attachments: attachments,
});

function Attachments() {
  const form = useReactiveForm<zod.infer<typeof attachmentsSchema>>({
    resolver: zodResolver(attachmentsSchema),
  });

  return (
    <>
      <Form {...form}>
        <FormField
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <div className={'flex flex-col items-center justify-center gap-4 px-6 py-12'}>
                  <div className={'bg-accent rounded-full p-8'}>
                    <UploadIcon />
                  </div>
                  <Button asChild className={'cursor-pointer'} variant={'outline'}>
                    <label>
                      <input
                        multiple
                        type={'file'}
                        accept={'*'}
                        className={'hidden'}
                        onChange={(event) => {
                          field.onChange(Array.from(event.target.files ?? []));
                        }}
                      />
                      <span className={'flex items-center gap-2'}>
                        <Plus />
                        Add files
                      </span>
                    </label>
                  </Button>
                  <FormDescription className={'text-center'}>You can upload up to 10 files, each file must be less than 500MB.</FormDescription>
                </div>
              </FormItem>
            );
          }}
          name={'attachments'}
        />
        <div className={'mt-2'}>
          {form.watch('attachments')?.length ? (
            <div className={'flex flex-col gap-2'}>
              {(form.watch('attachments') || []).map((file, index) => (
                <p key={index} className={'text-muted-foreground flex-grow text-sm'}>
                  {file.name}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </Form>
    </>
  );
}

function TimesheetItems(props: { timesheet?: Timesheet; assignment?: Assignment }) {
  const table = useTable<TimesheetItem>('/api/v1/timesheet-items', {
    defaultParams: {
      'filter[timesheet_id]': String(props.timesheet?.id ?? ''),
    },
    initialState: {
      pagination: {
        pageSize: 999
      }
    },
    columns: [
      {
        accessorKey: 'date',
        header: 'Date',
        size: 200,
        cell: ({ row }) => new Date(row.original.date || Date.now()).toLocaleDateString(),
      },
      {
        accessorKey: 'work_hours',
        header: 'Work (hrs)',
        size: 100,
        cell: ({ row }) => row.original.work_hours,
      },
      {
        accessorKey: 'travel_hours',
        header: 'Travel (hrs)',
        size: 100,
        cell: ({ row }) => row.original.travel_hours,
      },
      {
        accessorKey: 'report_hours',
        header: 'Report (hrs)',
        size: 100,
        cell: ({ row }) => row.original.report_hours,
      },
      {
        accessorKey: 'days',
        header: 'Days & Overnights',
        size: 100,
        cell: ({ row }) => `${row.original.days} / ${row.original.overnights}`,
      },
      {
        accessorKey: 'travel_distance',
        header: 'Travel Distance',
        size: 150,
        cell: ({ row }) => row.original.travel_distance,
      },
      {
        accessorKey: 'travel_rate',
        header: 'Travel Rate',
        size: 150,
        cell: ({ row }) => row.original.travel_rate.toFixed(2),
      },
      {
        accessorKey: 'expenses',
        header: 'Hotel ($)',
        size: 150,
        cell: ({ row }) => row.original.hotel,
      },
      {
        accessorKey: 'rail_or_airfare',
        header: 'Rail/Airfare ($)',
        size: 150,
        cell: ({ row }) => row.original.rail_or_airfare,
      },
      {
        accessorKey: 'meals',
        header: 'Meals ($)',
        size: 150,
        cell: ({ row }) => row.original.meals,
      },
    ],
  });
  return (
    <>
      <DataTable table={table} pagination={false} variant={'clean'} className={'max-w-full overflow-hidden bg-background'}/>
      {props.assignment && (
        <div className={'flex items-center justify-end gap-4'}>
          <TimesheetItemForm onSubmit={() => {table.reload()}} assignment={props.assignment}>
            <Button variant={'outline'}>
              <Plus />
              Log another
            </Button>
          </TimesheetItemForm>
          <Button variant={'default'}>Submit for Approval</Button>
        </div>
      )}
    </>
  );
}
