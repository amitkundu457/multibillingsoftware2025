'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

export default function TiptapEditorClient({ value, onChange }) {
 const editor = useEditor({
  extensions: [StarterKit],
  content: value,
  onUpdate: ({ editor }) => {
    onChange?.(editor.getHTML());
  },
  editorProps: {
    attributes: {
      class: 'min-h-[300px] p-2 border rounded bg-white focus:outline-none',
    },
  },
  autofocus: false,
  injectCSS: false,
  editorOptions: {
    // 👇 this is the key fix
    immediatelyRender: false,
  },
});


  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return editor ? <EditorContent editor={editor} /> : null;
}
