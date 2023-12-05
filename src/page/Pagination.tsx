import {  useLoaderData } from "react-router-dom"
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";

export default function Pagination() {
  const { notes, page } =  useLoaderData();

  return (
    <>
  <h2 className='mt-10 mb-10 text-center text-2xl font-bold leading-9'>
        Example of Pagination
      </h2>
 <DataTable columns={columns} data={notes.results} has_previous={notes.has_previous} has_next={notes.has_next} page={page} />
    </>

  )
}
