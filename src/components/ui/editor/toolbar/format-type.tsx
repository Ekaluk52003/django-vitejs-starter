
import { Editor } from "@tiptap/react"
import { PaintBucket, Type } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormatTypeProps {
  editor: Editor
}

export function FormatType({ editor }: FormatTypeProps) {
  const value = () => {
    if (editor.isActive("paragraph")) return "paragraph"
    if (editor.isActive("heading", { level: 1 })) return "h1"
    if (editor.isActive("heading", { level: 2 })) return "h2"
    if (editor.isActive("heading", { level: 3 })) return "h3"
    if (editor.isActive("heading", { level: 4 })) return "h4"
    if (editor.isActive("heading", { level: 5 })) return "h5"
    if (editor.isActive("heading", { level: 6 })) return "h6"
  }

  const onChange = (value: string) => {
    switch (value) {
      case "paragraph":
        editor.chain().focus().setParagraph().run()
        break
      case "h1":
        editor.chain().focus().toggleHeading({ level: 1 }).run()
        break
      case "h2":
        editor.chain().focus().toggleHeading({ level: 2 }).run()
        break
      case "h3":
        editor.chain().focus().toggleHeading({ level: 3 }).run()
        break
      case "h4":
        editor.chain().focus().toggleHeading({ level: 4 }).run()
        break
      case "h5":
        editor.chain().focus().toggleHeading({ level: 5 }).run()
        break
      case "h6":
        editor.chain().focus().toggleHeading({ level: 6 }).run()
        break
    }
  }

  return (
    <Select onValueChange={onChange} defaultValue={value()} value={value()}>
      <SelectTrigger className="h-8 w-[120px]">
        <SelectValue placeholder="Select format" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="paragraph">Paragraph</SelectItem>
          <SelectItem value="h1">H1</SelectItem>
          <SelectItem value="h2">H2</SelectItem>
          <SelectItem value="h3">H3</SelectItem>
          <SelectItem value="h4">H4</SelectItem>
          <SelectItem value="h5">H5</SelectItem>
          <SelectItem value="h6">H6</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}




export function FormatColor({ editor }: FormatTypeProps) {
 //@ts-expect-error expect
  function convertRgbColorsToHex(string) {
    return string.replace(/rgb\(\d+,\s*\d+,\s*\d+\)/g,
    //@ts-expect-error expect
      (rgbString) => "#" + rgbString
        .match(/\b(\d+)\b/g)
         //@ts-expect-error expect
        .map((digit) =>
          parseInt(digit).toString(16).padStart(2, "0").toUpperCase()
         )
        .join("")
      )
  }
  const value = () => {
       const  preColor = editor.getAttributes('textStyle').color

       if(!preColor) return "black"

     const color = convertRgbColorsToHex(editor.getAttributes('textStyle').color)


    if (editor.isActive('textStyle') && color == "#374151" ) return "black"
    if (editor.isActive('textStyle') && color == "#F00A29" ) return "red"
    if (editor.isActive('textStyle') && color == "#0943FF" ) return "blue"
    if (editor.isActive('textStyle') && color == "#FFFFFF" ) return "white"


  }

  const onChange = (value: string) => {

    switch (value) {
      case "black":
        editor.chain().focus().setColor('#374151').run()
        break
      case "red":
        editor.chain().focus().setColor('#F00A29').run()
        break
      case "blue":
        editor.chain().focus().setColor('#0943FF').run()
        break
      case "white":
        editor.chain().focus().setColor('#FFFFFF').run()
        break
    }
  }

  return (
    <Select onValueChange={onChange} defaultValue={value()} value={value()}>
      <SelectTrigger className="h-8 w-[60px] mr-1">
        <SelectValue placeholder="Color" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="black"><Type className="w-4 h-4"/></SelectItem>
          <SelectItem value="red"><Type className="w-4 h-4 text-red-500"/></SelectItem>
          <SelectItem value="blue"><Type className="w-4 h-4 text-blue-500"/></SelectItem>
          <SelectItem value="white"><Type className="w-4 h-4 text-gray-300"/></SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}


export function FormatHilight({ editor }: FormatTypeProps) {

   const value = () => {


        if(!editor.isActive('highlight'))  return "clear"
        if (editor.isActive('highlight',{ color: '#0adb0e' })) return "green"
        if (editor.isActive('highlight',{ color: '#f2f206' })) return "yellow"
        if (editor.isActive('highlight',{ color: '#f20a06' })) return "red"
        if (editor.isActive('highlight',{ color: '#0694f2' })) return "sky"
   }

   const onChange = (value: string) => {

     switch (value) {
      case "clear":
        editor.chain().focus().unsetHighlight().run()
        break
       case "green":
         editor.chain().focus().toggleHighlight({ color:'#0adb0e'}).run()
         break
       case "yellow":
         editor.chain().focus().toggleHighlight({ color:'#f2f206'}).run()
         break
       case "red":
         editor.chain().focus().toggleHighlight({ color:'#f20a06'}).run()
         break
       case "sky":
          editor.chain().focus().toggleHighlight({ color:'#0694f2'}).run()
        break
     }
   }

   return (
     <Select onValueChange={onChange} defaultValue={value()} value={value()}>
       <SelectTrigger className="h-8 w-[70px] mr-1">
         <SelectValue placeholder="Hilight" />
       </SelectTrigger>
       <SelectContent>
         <SelectGroup>
          <SelectItem value="clear"><PaintBucket  className="h-4 w-4" /></SelectItem>
           <SelectItem value="green"><PaintBucket  className="h-4 w-4 text-green-600" /></SelectItem>
           <SelectItem value="yellow"><PaintBucket  className="h-4 w-4 text-yellow-500" /></SelectItem>
           <SelectItem value="red"><PaintBucket  className="h-4 w-4 text-red-500" /></SelectItem>
           <SelectItem value="sky"><PaintBucket  className="h-4 w-4 text-blue-600" /></SelectItem>
         </SelectGroup>
       </SelectContent>
     </Select>
   )
 }
