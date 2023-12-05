import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Note = {
  title: string
  content:string
  created_at:string
  updated_at: string
}

export const columns: ColumnDef<Note>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "content",
    header: "Content",
  },
  {
    accessorKey: "created_at",
    header: "Create_At",
  },
  {
    accessorKey: "updated_at",
    header: "Updated_At",
  },
]

