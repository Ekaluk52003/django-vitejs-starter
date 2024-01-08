import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./toolbar/editor-toolbar";
// import Image from '@tiptap/extension-image'
import { ResizableImage } from "tiptap-extension-resizable-image";
import "tiptap-extension-resizable-image/styles.css";
import TextAlign from "@tiptap/extension-text-align";
import { Indent } from "@weiruo/tiptap-extension-indent";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Image from "@tiptap/extension-image";
import Cookies from "universal-cookie";
import { useToast } from "@/components/ui/use-toast";
// import Document from '@tiptap/extension-document'
// import Paragraph from '@tiptap/extension-paragraph'
// import Text from '@tiptap/extension-text'
const cookies = new Cookies();

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
      ResizableImage.configure({
        defaultWidth: 200,
        defaultHeight: 200,
        async onUpload(file: File) {
          /* replace with your own upload handler */

          const data = new FormData();
          data.append("file", file);

          toast({
          title: "It might take time as we are uploading to server",
          description: "We allow maximum 5 pictures , please clear clip board if you need to more picuture",
        })



         const response = await fetch("/api/v1/ememo/media/new/152", {
            method: "POST",
            credentials: "same-origin",
            headers: {
              "X-CSRFToken": cookies.get("csrftoken"),
            },
            body: data,
          });

          const reply = await response.json();


          const src = reply.url
          // const src = "https://picsum.photos/500/300"
          return {
            src,
            "data-keep-ratio": true,
          };
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Indent.configure({
        types: ["listItem", "paragraph", "heading"],
        minLevel: 0,
        maxLevel: 3,
      }),
      Underline,
      TextStyle,
      Color,
      Image,
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
