import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { VFormField } from '@/components/vform';
import { useReactiveForm } from '@/hooks/use-form';
import { usePagedGetApi } from '@/hooks/use-get-api';
import { Attachment, Comment } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, MessageCircle, Paperclip } from 'lucide-react';
import { z } from 'zod';
import { AttachmentItem } from '@/pages/timesheets/timesheet-items';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { useQueryParam } from '@/hooks/use-query-param';

const schema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
  attachments: z
    .array(z.instanceof(File).refine((file) => file.size < 524288000, 'File size must be less than 500MB'))
    .max(50, 'You can only upload up to 5 files')
    .optional(),
  private: z.boolean().optional(),
});

interface CommentsProps {
  commentableType: string;
  commentableId: number;
}

export function Comments(props: CommentsProps) {

  const [onlyAttachments, setOnlyAttachments] = useQueryParam('only_attachments', '0')

  const table = usePagedGetApi<Comment>('/api/v1/comments', {
    searchParams: new URLSearchParams({
      commentable_type: props.commentableType,
      commentable_id: props.commentableId.toString(),
      per_page: '999',
      include: 'attachments,user',
      sort: '-created_at',
      'filter[attachments]': onlyAttachments,
    }),
  });

  const form = useReactiveForm<z.infer<typeof schema>>({
    contentType: 'multipart/form-data',
    defaultValues: {
      content: '',
      private: false,
    },
    url: '/api/v1/comments',
    resolver: zodResolver(schema),
    serialize: (formData) => {
      const data = new FormData();
      data.set('commentable_type', props.commentableType);
      data.set('commentable_id', props.commentableId.toString());
      data.set('content', formData.content);
      data.set('private', formData.private ? '1' : '0');
      if (formData.attachments) {
        formData.attachments.forEach((file, index) => {
          data.append(`attachments[${index}]`, file);
        });
      }
      return data;
    },
  });

  const attachments = form.watch('attachments');

  function save() {
    form.submit().then(() => {
      form.reset();
      table?.refetch();
    });
  }

  return (
    <>
      <div className={'flex flex-col gap-4'}>
        <div className={'p-4 border rounded-lg bg-muted'}>
          <Form {...form} watch={form.watch}>
            <div className={'flex flex-col gap-4'}>
              <FormField
                control={form.control}
                render={({ field }) => (
                  <>
                    <VFormField error={form.formState.errors.attachments?.message}>
                      <Textarea
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={'Write a comment...'}
                        className={'bg-background h-36 resize-none'}
                      />
                    </VFormField>
                  </>
                )}
                name={'content'}
              />

              <div className={'flex items-center gap-2'}>
                <FormField
                  render={({ field }) => (
                    <Button asChild variant={'outline'} className={'cursor-pointer'}>
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
                        <Paperclip />
                        <span className={'hidden sm:inline'}>
                          {attachments && attachments.length > 0 ? (
                            <span>{attachments.length} selected</span>
                          ) : (
                            'Add Attachments'
                          )}
                        </span>
                      </label>
                    </Button>
                  )}
                  name={'attachments'}
                  control={form.control}
                />

                <FormField
                  control={form.control}
                  render={({ field }) => (
                    <Label className={'flex cursor-pointer items-center gap-2'}>
                      <Switch checked={field.value} onCheckedChange={(value) => field.onChange(!!value)} />
                      <span className={'hidden sm:inline'}>Private Comment</span>
                      <span className={'inline sm:hidden'}>Private</span>
                    </Label>
                  )}
                  name={'private'}
                />

                <div className={'flex-grow'}></div>

                <Button size={'sm'} disabled={form.formState.isSubmitting || !form.formState.isValid} onClick={save}>
                  <MessageCircle />
                  {(attachments ?? []).length > 0 ? 'Upload and Comment' : 'Comment'}
                </Button>
              </div>
            </div>
          </Form>
        </div>

        <div>
          <Label>
            <Switch checked={onlyAttachments === '1'} onCheckedChange={(checked) => {
              setOnlyAttachments(checked ? '1' : '0')
            }}/> Filter comments with attachment
          </Label>
        </div>


        {table.data && table.data.length ? (
          <>
            <Accordion type={'multiple'} defaultValue={['comments']}>
              <AccordionItem value={'attachments'}>
                <AccordionTrigger>All files in comments (click to expand)</AccordionTrigger>
                <AccordionContent>
                  <div className={'flex gap-4 items-center justify-start overflow-x-auto pb-1'}>
                    {
                      (table.data || []).reduce<Attachment[]>((attachments, item) => {
                        if (item.attachments) {
                          attachments.push(...item.attachments);
                        }
                        return attachments;
                      }, []).map((attachment, index) => {
                        return (
                          <AttachmentItem attachment={attachment} key={index}/>
                        );
                      })
                    }
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className={'grid gap-8 rounded-lg'}>
              {table.data.map((comment, index) => (
                <div key={`comment:${index}`} className={'grid gap-2 border-t pt-4'}>
                  <p className={'flex w-full items-center justify-start gap-2 text-sm'}>
                    <span className={'font-bold'}>{comment.user?.name ?? 'Anonymous'}</span>
                    <span className={'flex-grow inline-flex items-center justify-end gap-2'}>
                      {comment.private ? <Lock className={'size-4'} /> : null}
                      <span className={'text-muted-foreground text-xs'}>{new Date(comment.created_at).toLocaleString()}</span>
                    </span>
                  </p>
                  <p>{comment.content}</p>
                  <Attachments attachments={comment.attachments} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className={'text-muted-foreground py-6 text-center text-sm'}>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </>
  );
}

function Attachments(props: { attachments?: Attachment[] }) {
  const attachments = props.attachments ?? [];

  if (attachments.length === 0) {
    return null;
  }
  return (
    <>
      <div className={'flex flex-wrap gap-4'}>
        {attachments.map((attachment, index) => (
          <AttachmentDownload attachment={attachment} key={`attachment:${index}`} />
        ))}
      </div>
    </>
  );
}

function AttachmentDownload(props: { attachment: Attachment }) {
  return (
    <a href={route('attachments.download', { id: props.attachment.id })} target={'_blank'} className={'inline-flex items-center gap-1 text-sm border py-1 px-2 rounded-lg'}>
      <Paperclip className={'size-4'} />
      {props.attachment.name}
    </a>
  );
}
