
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
  Underline,
  Grid3X3,
  CopyMinus,
  Upload

} from "lucide-react"

import { ToggleGroup, Toolbar } from "@/components/toolbar"

import { Toggle } from "../../toggle"
import { FormatType, FormatColor, FormatHilight } from "./format-type"

interface EditorToolbarProps {
  editor: Editor
}

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  return (
     <>
    <Toolbar className="m-0 flex flex-wrap items-center justify-between p-2" aria-label="Formatting options">

      <ToggleGroup className="flex flex-wrap items-center" type="multiple">
      <Toggle
          size="icon"
          className="mr-1"
          tooltip="Bold"
          onPressedChange={() => {
            const url = window.prompt('post image link from the file upload')
            if (url) {


              editor.chain().focus().setImage({ src: url }).run()

            }
          }}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          pressed={editor.isActive("bold")}>
          < Upload className="h-4 w-4" />
        </Toggle>



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
        <FormatHilight editor={editor} />
        <FormatType editor={editor} />

      </ToggleGroup>




<ToggleGroup className="flex flex-wrap items-center" type="multiple">
  <Toggle
    size="icon"
    className="mr-1"
    tooltip="Add Table"
    onPressedChange={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
    pressed={editor.isActive({ textAlign: "" })}

>
    < Grid3X3 className="h-4 w-4" />
  </Toggle>
        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Add col before"
          onPressedChange={() => editor.chain().focus().addColumnBefore().run()}
          pressed={editor.isActive({ textAlign: "" })}
         >

          <svg className="w-4 h-4" fill="#3e3c3c" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M120 180v1560c0 33 26.88 60 60 60h1020V120H180c-33.12 0-60 27-60 60Zm1620-60h-420v480h480V180c0-33-26.88-60-60-60Zm60 600h-480v480h480V720Zm-60 1080c33.12 0 60-27 60-60v-420h-480v480h420ZM180 1920c-99.24 0-180-80.76-180-180V180C0 80.76 80.76 0 180 0h1560c99.24 0 180 80.76 180 180v1560c0 99.24-80.76 180-180 180H180Zm596.484-510h-240v-330h-330V840h330V510h240v330h330v240h-330v330Z" fillRule="evenodd"></path> </g></svg>
        </Toggle>
        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Add col after"
          onPressedChange={() => editor.chain().focus().addColumnAfter().run()}
          pressed={editor.isActive({ textAlign: "" })}
         >
     <svg className="w-4 h-4" fill="#3e3c3c" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1740 0c99.24 0 180 80.76 180 180v1560c0 99.24-80.76 180-180 180H180c-99.24 0-180-80.76-180-180V180C0 80.76 80.76 0 180 0h1560Zm60 1740V180c0-33-26.88-60-60-60H720v1680h1020c33.12 0 60-27 60-60Zm-1620 60h420v-480H120v420c0 33 26.88 60 60 60Zm-60-600h480V720H120v480Zm60-1080c-33.12 0-60 27-60 60v420h480V120H180Zm963.516 390h240v330h330v240h-330v330h-240v-330h-330V840h330V510Z" fillRule="evenodd"></path> </g></svg>
        </Toggle>
        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Del column"
          onPressedChange={() => editor.chain().focus().deleteColumn().run()}
          pressed={editor.isActive({ textAlign: "" })}
         >
     <svg  className="w-4 h-4" fill="#3e3c3c" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1800 1740c0 33-27 60-60 60h-420v-300h-120v300H720v-300H600v300H180c-33.12 0-60-27-60-60V180c0-33 26.88-60 60-60h420v300h120V120h480v300h120V120h420c33 0 60 27 60 60v1560ZM1740 0H180C80.76 0 0 80.76 0 180v1560c0 99.24 80.76 180 180 180h1560c99.24 0 180-80.76 180-180V180c0-99.24-80.76-180-180-180Zm-305.16 654.84-169.68-169.68L960 790.32 654.84 485.16 485.16 654.84 790.32 960l-305.16 305.16 169.68 169.68L960 1129.68l305.16 305.16 169.68-169.68L1129.68 960l305.16-305.16Z" fillRule="evenodd"></path> </g></svg>
        </Toggle>
        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Add row before"
          onPressedChange={() => editor.chain().focus().addRowBefore().run()}
          pressed={editor.isActive({ textAlign: "" })}
         >
     <svg className="w-4 h-4" fill="#3e3c3c" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1740 120H180c-33 0-60 26.88-60 60v1020h1680V180c0-33.12-27-60-60-60Zm60 1620v-420h-480v480h420c33 0 60-26.88 60-60Zm-600 60v-480H720v480h480Zm-1080-60c0 33.12 27 60 60 60h420v-480H120v420ZM0 180C0 80.76 80.76 0 180 0h1560c99.24 0 180 80.76 180 180v1560c0 99.24-80.76 180-180 180H180c-99.24 0-180-80.76-180-180V180Zm510 596.484v-240h330v-330h240v330h330v240h-330v330H840v-330H510Z" fillRule="evenodd"></path> </g></svg>
        </Toggle>
        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Add row after"
          onPressedChange={() => editor.chain().focus().addRowAfter().run()}
          pressed={editor.isActive({ textAlign: "" })}
         >
       <svg  className="w-4 h-4" fill="#3e3c3c" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M180 1800h1560c33 0 60-26.88 60-60V720H120v1020c0 33.12 27 60 60 60ZM120 180v420h480V120H180c-33 0-60 26.88-60 60Zm600-60v480h480V120H720Zm1080 60c0-33.12-27-60-60-60h-420v480h480V180Zm120 1560c0 99.24-80.76 180-180 180H180c-99.24 0-180-80.76-180-180V180C0 80.76 80.76 0 180 0h1560c99.24 0 180 80.76 180 180v1560Zm-510-596.484v240h-330v330H840v-330H510v-240h330v-330h240v330h330Z" fillRule="evenodd"></path> </g></svg>
        </Toggle>
        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Delete Row"
          onPressedChange={() => editor.chain().focus().deleteRow().run()}
          pressed={editor.isActive({ textAlign: "" })}
         >
          <svg  className="w-4 h-4" fill="#3e3c3c" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M180 1800c-33 0-60-27-60-60v-420h300v-120H120V720h300V600H120V180c0-33.12 27-60 60-60h1560c33 0 60 26.88 60 60v420h-300v120h300v480h-300v120h300v420c0 33-27 60-60 60H180Zm1740-60V180c0-99.24-80.76-180-180-180H180C80.76 0 0 80.76 0 180v1560c0 99.24 80.76 180 180 180h1560c99.24 0 180-80.76 180-180ZM485.32 1265 655 1434.68l305.16-305.16 305.16 305.16L1435 1265l-305.16-305.16L1435 654.68 1265.32 485 960.16 790.16 655 485 485.32 654.68l305.16 305.16L485.32 1265Z" fillRule="evenodd"></path> </g></svg>
        </Toggle>
        <Toggle
          size="icon"
          className="mr-1"
          tooltip="Delete Table"
          onPressedChange={() => editor.chain().focus().deleteTable().run()}
          pressed={editor.isActive({ textAlign: "" })}
         >
          <CopyMinus className="h-4 w-4" />
        </Toggle>

</ToggleGroup>
<div>
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
</div>

    </Toolbar>

    </>

  )
}

export default EditorToolbar
