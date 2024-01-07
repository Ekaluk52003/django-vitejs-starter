
import { Editor } from "@tiptap/react"
import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Undo,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  PanelLeftClose,
  PanelLeftOpen,
  Underline
} from "lucide-react"

import { ToggleGroup, Toolbar } from "@/components/toolbar"

import { Toggle } from "../../toggle"
import { FormatType, FormatColor } from "./format-type"

interface EditorToolbarProps {
  editor: Editor
}

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  return (
    <Toolbar className="m-0 flex flex-wrap items-center justify-between p-2" aria-label="Formatting options">


      <ToggleGroup className="flex flex-wrap items-center" type="multiple">



        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Bold"
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          pressed={editor.isActive("bold")}>
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Italic"
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          pressed={editor.isActive("italic")}
          value="italic">
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="icon"
          className="mr-1"
          tooltip="underline"
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          pressed={editor.isActive('underline')}
          value="underline">
          <Underline className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Strike through"
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          pressed={editor.isActive("strike")}>
          <Strikethrough className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="icon"
          className="mr-1"
          tooltip="align left"
          onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
          disabled={!editor.can().chain().focus().setTextAlign("left").run()}
          pressed={editor.isActive({ textAlign: "left" })}>
          <AlignLeft className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="icon"
          className="mr-1"
          tooltip="center"
          onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
          disabled={!editor.can().chain().focus().setTextAlign("center").run()}
          pressed={editor.isActive({ textAlign: "center" })}>
          <AlignCenter className="h-4 w-4" />
        </Toggle>


        <Toggle
          size="icon"
          className="mr-1"
          tooltip="align right"
          onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
          disabled={!editor.can().chain().focus().setTextAlign("right").run()}
          pressed={editor.isActive({ textAlign: "right" })}>
          < AlignRight className="h-4 w-4" />
        </Toggle>


        <Toggle
          size="icon"
          className="mr-1"
          tooltip="align justify"
          onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
          disabled={!editor.can().chain().focus().setTextAlign("justify").run()}
          pressed={editor.isActive({ textAlign: "justify" })}>
          < AlignJustify className="h-4 w-4" />
        </Toggle>


        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Bullet list"
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          pressed={editor.isActive("bulletList")}>
          <List className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Numbered list"
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          pressed={editor.isActive("orderedList")}>
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="icon"
          className="mr-1"
          tooltip="ย่อหน้า"
          onPressedChange={() => editor.chain().focus().indent().run()}
          disabled={!editor.can().chain().focus().focus().indent().run()}
          pressed={editor.isActive({ textAlign: "" })}
          >

          < PanelLeftOpen className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="icon"
          className="mr-1"
          tooltip="ย่อหน้า"
          onPressedChange={() => editor.chain().focus().outdent().run()}
          disabled={!editor.can().chain().focus().focus().outdent().run()}
          pressed={editor.isActive({ textAlign: "" })}
          >

          < PanelLeftClose className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Code block"
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
          pressed={editor.isActive("codeBlock")}>
          <Code className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Block quote"
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          pressed={editor.isActive("blockquote")}>
          <Quote className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Horizontal rule"
          onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-4 w-4" />
        </Toggle>


        <FormatColor editor={editor} />
        <FormatType editor={editor} />
      </ToggleGroup>

      <ToggleGroup className="flex flex-wrap items-center" type="multiple">
        <Toggle
          size="icon"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}>
          <Undo className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="icon"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}>
          <Redo className="h-4 w-4" />
        </Toggle>
      </ToggleGroup>
    </Toolbar>
  )
}

export default EditorToolbar
