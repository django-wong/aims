import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { MessageCircle, File as FileIcon, Paperclip, Download, Lock } from 'lucide-react';
import { Attachment, Comment } from '@/types';
import { useReactiveForm } from '@/hooks/use-form';
import { VFormField } from '@/components/vform';
import { usePagedGetApi } from '@/hooks/use-get-api';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Link } from '@inertiajs/react';

const schema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
  attachments: z.array(
    z.instanceof(File).refine(file => file.size < 524288000, 'File size must be less than 500MB'),
  ).max(5, 'You can only upload up to 5 files').optional(),
  private: z.boolean().optional(),
});

interface CommentsProps {
  commentableType: string;
  commentableId: number;
}

export function Comments(props: CommentsProps) {
  const table = usePagedGetApi<Comment>('/api/v1/comments', {
    searchParams: new URLSearchParams({
      'commentable_type': props.commentableType,
      'commentable_id': props.commentableId.toString(),
      'per_page': '1999',
      'include': 'attachments,user',
      'sort': '-created_at',
    })
  });

  const form = useReactiveForm<z.infer<typeof schema>>({
    contentType: 'multipart/form-data',
    defaultValues: {
      content: 'My awesome comment',
      private: false
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
    }
  });

  const attachments = form.watch('attachments');

  function save() {
    form.submit().then((response) => {
      if (response && response.ok) {
        form.reset();
        table.refetch();
      }
    });
  }

  return (
    <>
      <div className={'py-6 flex flex-col gap-8'}>
        <div className={''}>
          <Form {...form} watch={form.watch}>
            <div className={'flex flex-col gap-4'}>
              <FormField
                control={form.control}
                render={({ field }) => (
                  <>
                    <VFormField for={'content'} error={form.formState.errors.content?.message || form.formState.errors.attachments?.message}>
                      <Textarea
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={'Write a comment...'}
                        className={'bg-background h-24 resize-none'}
                      />
                    </VFormField>
                  </>
                )}
                name={'content'}
              />

              <div className={'flex gap-2 items-center'}>
                <FormField
                  render={({ field }) => (
                    <Button asChild variant={'outline'} className={'cursor-pointer'}>
                      <label>
                        <input
                          multiple type={'file'} accept={'*'} className={'hidden'}
                          onChange={(event) => {
                            console.info(event);
                            field.onChange(Array.from(event.target.files ?? []));
                          }}
                        />
                        <Paperclip />
                        Add Attachments
                      </label>
                    </Button>
                  )}
                  name={'attachments'}
                  control={form.control}
                />

                <FormField
                  control={form.control}
                  render={({field}) => (
                    <Button asChild variant={'outline'} className={'cursor-pointer'}>
                      <Label className={'cursor-pointer flex items-center gap-2'}>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(value) => field.onChange(!!value)}
                        />
                        Private Comment
                      </Label>
                    </Button>
                  )}
                  name={'private'}
                />

                <div className={'flex-grow'}></div>

                <Button size={'sm'} disabled={form.formState.isSubmitting || !form.formState.isValid} onClick={save}>
                  <MessageCircle />
                  { (attachments ?? []).length > 0 ? 'Upload and Comment' : 'Comment' }
                </Button>
              </div>

              {((attachments ?? []).length > 0) && (
                <div className={'flex flex-col gap-[1px]'}>
                  {(attachments ?? []).map((file) => (
                    <>
                      <span className={'text-sm flex items-center gap-2'}>
                        <FileIcon className={'size-4'}/> { file.name }
                      </span>
                    </>
                  ))}
                </div>
              )}
            </div>
          </Form>
        </div>
        <div className={'flex flex-col bg-background rounded-lg border px-6 py-8'}>
          {table.data.map((comment, index) => (
            <>
              <div key={index} className={index > 0 ? 'mt-8 border-t pt-8' : ''}>
                <div className={'flex justify-between items-center mb-2'}>
                  <p className={'text-sm flex items-center justify-between gap-1 w-full'}>
                    <strong>
                      {comment.user?.name ?? 'Anonymous'}
                    </strong>
                    <span className={'inline-flex justify-end items-center gap-2'}>
                      {comment.private ? (
                        <Lock className={'size-4'}/>
                      ) : null}
                      <span className={'text-xs text-muted-foreground ml-2'}>
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </span>
                  </p>
                </div>
                <p className={'pt-2'}>
                  {comment.content}
                </p>
                <Attachments attachments={comment.attachments} />
              </div>
            </>
          ))}
        </div>
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
          <AttachmentDownload
            attachment={attachment}
            key={index}
          />
        ))}
      </div>
    </>
  );
}

function AttachmentDownload(props: { attachment: Attachment }) {
  return (
    <a href={route('attachments.download', {id: props.attachment.id})} target={'_blank'} className={'inline-flex text-sm items-center gap-1'}>
      <Paperclip className={'size-4'}/>
      {props.attachment.name}
    </a>
  );
}
