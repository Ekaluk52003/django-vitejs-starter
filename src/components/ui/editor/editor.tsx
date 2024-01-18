import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./toolbar/editor-toolbar";

import { TextAlign } from "@tiptap/extension-text-align";
import { Indent } from "@weiruo/tiptap-extension-indent";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

import { MyImage } from "./extension/image";
import { useEffect } from 'react'


interface EditorProps {
  content: string;
  placeholder?: string;
  editable:boolean;
  onChange: (value: string) => void;
}



const Editor = ({ content, placeholder, onChange, editable }: EditorProps) => {


  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
      // TextAlign.configure({ types: ["heading", "paragraph"] }),
      //Support Imag alligment
      MyImage,

      Indent.configure({
        types: ["listItem", "paragraph", "heading"],
        minLevel: 0,
        maxLevel: 3,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Table.extend({
        renderHTML({ HTMLAttributes }) {
          return [
            "div",
            { class: "mytable" },
            ["table", HTMLAttributes, ["tbody", 0]],
          ];
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],

    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  useEffect(() => {
    if (!editor) {
      return undefined
    }
    if(!editable ) {
      editor.setEditable(false)
    }

    editor.setEditable(editable)
  }, [editor, editable])

  if (!editor) {
    return null
  }

  return (
    <div className='prose max-w-none w-full border border-input bg-background dark:prose-invert'>


      { editable ?   <EditorToolbar editor={editor} /> : ""}

      <div className='editor'>
        <EditorContent editor={editor} placeholder={placeholder}  />
      </div>
    </div>
  );
};

export default Editor;
