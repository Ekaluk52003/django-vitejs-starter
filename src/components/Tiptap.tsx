import { useEditor, EditorContent } from "@tiptap/react";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import { Toggle } from "@/components/ui/toggle";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Heading1,
  Italic,
  Undo2,
  Redo2,
  List,
  ListOrdered,
  Strikethrough,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Underline as Line,
} from "lucide-react";


const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className='flex flex-row items-center gap-2 p-2 mt-6 mb-0 border rounded-t-2xl'>
      <div className='flex flex-wrap gap-3'>
        <Toggle
          size='sm'
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className='w-4 h-4' />
        </Toggle>

        <Toggle
          size='sm'
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className='w-4 h-4' />
        </Toggle>
        <Toggle
          size='sm'
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Line className='w-4 h-4' />
        </Toggle>
        <Toggle
          size='sm'
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className='w-4 h-4' />
        </Toggle>

        <Toggle
          size='sm'
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List className='w-4 h-4' />
        </Toggle>
        <Toggle
          size='sm'
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className='w-4 h-4' />
        </Toggle>
        <Toggle
          size='sm'
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
        >
          <AlignLeft className='w-4 h-4' />
        </Toggle>
        <Toggle
          size='sm'
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
        >
          <AlignCenter className='w-4 h-4' />
        </Toggle>
        <Toggle
          size='sm'
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
        >
          <AlignRight className='w-4 h-4' />
        </Toggle>

        <Toggle
          size='sm'
          pressed={editor.isActive("heading")}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className='w-4 h-4' />
        </Toggle>

        {/* <input
        type="color"
        onInput={event => editor.chain().focus().setColor(event.target.value).run()}
        value={editor.getAttributes('textStyle').color}

      /> */}

        <button  type="button"
          onClick={() => editor.chain().focus().setColor("#ff0000").run()}
          className={
            editor.isActive("textStyle", { color: "#ff0000" })
              ? "is-active"
              : ""
          }
          data-testid='setRed'
        >
          <span className='text-red-600'>Red</span>
        </button>


        <button  type="button" onClick={() => editor.chain().focus().setColor("#060ba7").run()}
          className={
            editor.isActive("textStyle", { color: "#060ba7" })
              ? "is-active"
              : ""
          }
          data-testid='setBlue'
        >
          <span className='text-blue-500'>Blue</span>
        </button>
        <button  type="button"
          onClick={() => editor.chain().focus().setColor("#000000").run()}
          className={
            editor.isActive("textStyle", { color: "#000000" })
              ? "is-active"
              : ""
          }
          data-testid='setBlue'
        >
          <span>Black</span>
        </button>
        <button onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className='w-4 h-4' />
        </button>
        <button onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
};

export const Tiptap = ({ content, onChange }:{
  content:string
  onChange:(richText:string) => void
}) => {
  const editor = useEditor({
    extensions: [
      TextStyle,
      Color,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      StarterKit.configure({
        heading: {
          HTMLAttributes: {
            class: "font-extrabold tracking-tight lg:text-5xl",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },

        paragraph: {
          HTMLAttributes: {
            class: "text-lg",
          },
        },
      }),
    ],

    editorProps: {

      attributes: {
        class:
          "min-h-[280px] max-h-[380px] w-full border-x border-b rounded-b-xl border-input px-3 py-4 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
      },
    },
    content: content,

    onUpdate: ({ editor }) => {

      onChange(editor.getHTML())

    },
  });

  return (
    <div className='flex flex-col'>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
