import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./toolbar/editor-toolbar";
// import ImageResize from 'tiptap-extension-resize-image';

// import ImageResize from 'tiptap-imagresize' not work at all;

// import { ResizableImage } from 'tiptap-extension-resizable-image work'
// import "tiptap-extension-resizable-image/styles.css" work;

// import TextAlign from "@tiptap/extension-text-align";
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
// import Image from "@tiptap/extension-image";
import { useToast } from "@/components/ui/use-toast";
// import Document from '@tiptap/extension-document'
// import Paragraph from '@tiptap/extension-paragraph'
// import Text from '@tiptap/extension-text'
import { MyImage } from "./extension/image";


interface EditorProps {
  content: string;
  placeholder?: string;
  onChange: (value: string) => void;
}



const Editor = ({ content, placeholder, onChange }: EditorProps) => {

  const { toast } = useToast();
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
      //Support Imag alligment
      MyImage,
      // ImageResize,
        // Image.configure({
        //   HTMLAttributes: {
        //     class: 'mx-auto',
        //   },
        // }),

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

  if (!editor) return <></>;

  return (
    <div className='prose max-w-none w-full border border-input bg-background dark:prose-invert'>
      <EditorToolbar editor={editor} />
      <div className='editor'>
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  );
};

export default Editor;
