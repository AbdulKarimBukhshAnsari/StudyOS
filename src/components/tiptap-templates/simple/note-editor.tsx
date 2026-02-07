'use client';

import { useEffect, useRef } from 'react';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import {
  Toolbar,
  ToolbarGroup,
} from '@/components/tiptap-ui-primitive/toolbar';
import { MarkButton } from '@/components/tiptap-ui/mark-button';
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu';
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu';
import { ImageUploadButton } from '@/components/tiptap-ui/image-upload-button';
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node/image-upload-node-extension';
import { handleImageUpload, MAX_FILE_SIZE } from '@/lib/tiptap-utils';
import type { JSONContent } from '@tiptap/core';
import '@/components/tiptap-templates/simple/simple-editor.scss';

const defaultContent: JSONContent = { type: 'doc', content: [] };

interface NoteEditorProps {
  initialContent: JSONContent | null;
  onContentChange: (json: JSONContent) => void;
  editorKey?: string;
}

export function NoteEditor({
  initialContent,
  onContentChange,
  editorKey = 'default',
}: NoteEditorProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Note content',
        class: 'simple-editor',
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: { openOnClick: false, enableClickSelection: true },
      }),
      Image,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (e) => console.error('Upload failed:', e),
      }),
    ],
    content: initialContent ?? defaultContent,
  }, [editorKey]);

  useEffect(() => {
    if (!editor) return;
    const handler = () => onContentChange(editor.getJSON());
    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
    };
  }, [editor, onContentChange]);

  if (!editor) return null;

  return (
    <div className="simple-editor-wrapper min-h-[200px]">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar ref={toolbarRef}>
          <ToolbarGroup>
            <HeadingDropdownMenu levels={[1, 2, 3]} portal={false} />
            <ListDropdownMenu types={['bulletList', 'orderedList']} portal={false} />
          </ToolbarGroup>
          <ToolbarGroup>
            <MarkButton type="bold" />
            <MarkButton type="italic" />
            <MarkButton type="underline" />
          </ToolbarGroup>
          <ToolbarGroup>
            <ImageUploadButton text="Image" />
          </ToolbarGroup>
        </Toolbar>
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  );
}
