import { Button } from '@/components/ui/button';
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
import { UndoRedo, Placeholder, Gapcursor } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import {
  BetweenHorizonalEndIcon,
  BetweenHorizonalStartIcon,
  BetweenVerticalEndIcon,
  BetweenVerticalStartIcon,
  BoldIcon,
  FoldHorizontalIcon,
  FoldVerticalIcon,
  HeadingIcon,
  Table2,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  CodeIcon,
  LinkIcon,
  ImageIcon,
  UndoIcon,
  RedoIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

interface EditorProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function Editor(props: EditorProps) {
  const [showTableOptions, setShowTableOptions] = useState(false);
  const editor = useEditor({
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      props.onChange?.(html);
    },
    onSelectionUpdate: ({ editor }) => {
      const { selection } = editor.state;
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
      Placeholder.configure({
        placeholder: 'Type something here...',
      }),
      Gapcursor,
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
    content: props.value,
  });
  return (
    <div className={cn('', props.className)}>
      <div className={'sticky top-0 left-0 z-50 flex flex-wrap gap-0 border-b p-3 bg-accent'}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <HeadingIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={'w-48'} align={'start'} side={'bottom'}>
            <DropdownMenuLabel>Heading</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
                Heading 1<DropdownMenuShortcut>H1</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                Heading 2<DropdownMenuShortcut>H2</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
                Heading 3<DropdownMenuShortcut>H3</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}>
                Heading 4<DropdownMenuShortcut>H4</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 5 }).run()}>
                Heading 5<DropdownMenuShortcut>H5</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 6 }).run()}>
                Heading 6<DropdownMenuShortcut>H6</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => editor?.chain().focus().setParagraph().run()}>
                Normal text
                <DropdownMenuShortcut>P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'bg-accent text-accent-foreground' : ''}
        >
          <BoldIcon />
        </Button>

        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'bg-accent text-accent-foreground' : ''}
        >
          <ItalicIcon />
        </Button>

        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={editor?.isActive('underline') ? 'bg-accent text-accent-foreground' : ''}
        >
          <UnderlineIcon />
        </Button>

        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={editor?.isActive('strike') ? 'bg-accent text-accent-foreground' : ''}
        >
          <StrikethroughIcon />
        </Button>

        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? 'bg-accent text-accent-foreground' : ''}
        >
          <ListIcon />
        </Button>

        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive('orderedList') ? 'bg-accent text-accent-foreground' : ''}
        >
          <ListOrderedIcon />
        </Button>

        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={editor?.isActive('blockquote') ? 'bg-accent text-accent-foreground' : ''}
        >
          <QuoteIcon />
        </Button>

        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) {
              editor?.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={editor?.isActive('link') ? 'bg-accent text-accent-foreground' : ''}
        >
          <LinkIcon />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <Table2 />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={'w-56'} align={'start'} side={'bottom'}>
            <DropdownMenuLabel>Table</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
              Insert table
              <DropdownMenuShortcut>
                <Table2 />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            {showTableOptions && (
              <>
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
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant={'ghost'} size={'icon'} onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()}>
          <UndoIcon />
        </Button>

        <Button variant={'ghost'} size={'icon'} onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()}>
          <RedoIcon />
        </Button>
      </div>
      <div className={'prose prose-td:p-2 prose-th:p-2 prose-table:border prose-td:border prose-th:border prose-td:*:p-0 max-w-full!'}>
        <EditorContent editor={editor} className={'*:px-5 *:py-3 *:outline-0'} />
      </div>
      <FloatingMenu editor={editor}></FloatingMenu>
      <BubbleMenu editor={editor} />
    </div>
  );
}
