import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import EditorToolbar from "./toolbar/editor-toolbar"
// import Image from '@tiptap/extension-image'
import { ResizableImage } from 'tiptap-extension-resizable-image';
import 'tiptap-extension-resizable-image/styles.css';
import TextAlign from "@tiptap/extension-text-align";
import { Indent } from '@weiruo/tiptap-extension-indent'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
// import Document from '@tiptap/extension-document'
// import Paragraph from '@tiptap/extension-paragraph'
// import Text from '@tiptap/extension-text'

interface EditorProps {
  content: string
  placeholder?: string
  onChange: (value: string) => void
}

const Editor = ({ content, placeholder, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit,  ResizableImage.configure({
      defaultWidth: 200,
      defaultHeight: 200,
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Indent.configure({
      types: ['listItem', 'paragraph', 'heading'],
      minLevel: 0,
      maxLevel: 3,
  }),
  Underline,
  TextStyle,
  Color,
  ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return <></>

  return (
    <div className="prose max-w-none w-full border border-input bg-background dark:prose-invert">
      <EditorToolbar editor={editor} />
      <div className="editor">
        <EditorContent
          editor={editor}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default Editor
