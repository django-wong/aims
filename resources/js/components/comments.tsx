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
import { File as FileIcon, Lock, MessageCircle, Paperclip } from 'lucide-react';
import { z } from 'zod';

const schema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
  attachments: z
    .array(z.instanceof(File).refine((file) => file.size < 524288000, 'File size must be less than 500MB'))
    .max(5, 'You can only upload up to 5 files')
    .optional(),
  private: z.boolean().optional(),
});

interface CommentsProps {
  commentableType: string;
  commentableId: number;
}

export function Comments(props: CommentsProps) {
  const table = usePagedGetApi<Comment>('/api/v1/comments', {
    searchParams: new URLSearchParams({
      commentable_type: props.commentableType,
      commentable_id: props.commentableId.toString(),
      per_page: '999',
      include: 'attachments,user',
      sort: '-created_at',
    }),
  });

  const form = useReactiveForm<z.infer<typeof schema>>({
    contentType: 'multipart/form-data',
    defaultValues: {
      content: 'My awesome comment',
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
        <div className={''}>
          <Form {...form} watch={form.watch}>
            <div className={'flex flex-col gap-4'}>
              <FormField
                control={form.control}
                render={({ field }) => (
                  <>
                    <VFormField>
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
                            console.info(event);
                            field.onChange(Array.from(event.target.files ?? []));
                          }}
                        />
                        <Paperclip />
                        <span className={'hidden sm:inline'}>Add Attachments</span>
                      </label>
                    </Button>
                  )}
                  name={'attachments'}
                  control={form.control}
                />

                <FormField
                  control={form.control}
                  render={({ field }) => (
                    <Button asChild variant={'outline'} className={'cursor-pointer'}>
                      <Label className={'flex cursor-pointer items-center gap-2'}>
                        <Switch checked={field.value} onCheckedChange={(value) => field.onChange(!!value)} />
                        Private <span className={'hidden sm:inline'}>Comment</span>
                      </Label>
                    </Button>
                  )}
                  name={'private'}
                />

                <div className={'flex-grow'}></div>

                <Button size={'sm'} disabled={form.formState.isSubmitting || !form.formState.isValid} onClick={save}>
                  <MessageCircle />
                  {(attachments ?? []).length > 0 ? 'Upload and Comment' : 'Comment'}
                </Button>
              </div>

              {(attachments ?? []).length > 0 && (
                <div className={'flex flex-col gap-[1px]'}>
                  {(attachments ?? []).map((file, index) => (
                    <span key={`upload:${index}`} className={'flex items-center gap-2 text-sm'}>
                      <FileIcon className={'size-4'} /> {file.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Form>
        </div>
        {table.data.length ? (
          <div className={'flex flex-col rounded-lg px-1'}>
            {table.data.map((comment, index) => (
              <>
                <div key={`comment:${index}`} className={index > 0 ? 'mt-6 border-t pt-6' : ''}>
                  <p className={'flex w-full items-center justify-start gap-2 text-sm'}>
                    <strong>{comment.user?.name ?? 'Anonymous'}</strong>
                    <span className={'inline-flex items-center justify-end gap-2'}>
                      <span className={'text-muted-foreground text-xs'}>{new Date(comment.created_at).toLocaleString()}</span>
                      {comment.private ? <Lock className={'size-4'} /> : null}
                    </span>
                  </p>
                  <p className={'pt-2'}>{comment.content}</p>
                  <Attachments attachments={comment.attachments} />
                </div>
              </>
            ))}
          </div>
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
      <div className={'mt-4 flex flex-wrap gap-4'}>
        {attachments.map((attachment, index) => (
          <AttachmentDownload attachment={attachment} key={`attachment:${index}`} />
        ))}
      </div>
    </>
  );
}

function AttachmentDownload(props: { attachment: Attachment }) {
  return (
    <a href={route('attachments.download', { id: props.attachment.id })} target={'_blank'} className={'inline-flex items-center gap-1 text-sm'}>
      <Paperclip className={'size-4'} />
      {props.attachment.name}
    </a>
  );
}
