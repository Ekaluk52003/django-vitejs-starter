import { ColumnDef } from "@tanstack/react-table"
import { Link } from 'react-router-dom'
import { Link as Iconlink } from 'lucide-react';
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Ememo = {
  id:string
  title: string
  author:string
  assignnee: string
  step: string
  updated_at: string
}
import dayjs from "dayjs";
export const EmemoColumns: ColumnDef<Ememo>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: (props) => (<Link to={`/dashboard/ememo/${props.row.original.id}`}><Iconlink className="w-4 inline-flex mr-1"/>{props.getValue()}</Link>)
  },
  {
    accessorKey: "step",
    header: "Status",
  },
  {
    accessorKey: "author.fullname",
    header: "Submitted By",
  },
  {
    accessorKey: "assignnee.fullname",
    header: "Assignnee",
    cell: (props) => <span>{(props.getValue())}</span>
  },

  {
    accessorKey: "updated_at",
    header: "Updated_At",
    cell: (props) => <span>{dayjs(props.getValue()).format("D MMM D ddd, YYYY, HH:mm a")}</span>
  },
]

