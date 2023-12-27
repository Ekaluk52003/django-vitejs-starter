import {
  useLoaderData,
  Form,
  useSearchParams,
  useSubmit
} from "react-router-dom";
import { DataTable } from "@/components/data-table";
import { EmemoColumns } from "@/components/Ememocol"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

export default function Allmemo() {
  // @ts-expect-error ignore //
    const { ememos, page, term, perpage } = useLoaderData();
    const inputRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();
  return (
    <>
     <h2 className='mt-4 mb-10 text-2xl font-bold leading-9'>
        All Ememo
      </h2>
      <Form id='search-form' role='search' className="flex">
        <Input
          ref={inputRef}
         className="max-w-sm"
          id='term'
          aria-label='Search contacts'
          placeholder='Search'
          type='search'
          name='term'
          defaultValue={term}
        />
        {/* existing code */}
        <Button type='submit' className="ml-2">search</Button>
      </Form>
      <Form id="search-form" role="search">
            <Input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="hidden"

              onSubmit={(event) => {
                searchParams.delete('term');
                searchParams.delete('perpage');
                searchParams.delete('page');
                setSearchParams(searchParams);
                inputRef.current!.value = "";
                submit(null,{method:"GET"});
              }}
            />
             <Button type='submit' className="ml-2">Clear search</Button>
          </Form>

      <DataTable
        columns={EmemoColumns}
        data={ememos.results}
      />
      <div className='flex flex-col items-center justify-end gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
        <div className='flex items-center space-x-2'>
          <p className='whitespace-nowrap text-sm font-medium'>Rows per page</p>
          <Form id='search-form' role='search'>
            <Select
              defaultValue={perpage}
              onValueChange={(value) => {
                setSearchParams((searchParams) => {
                  searchParams.set("perpage", value);
                  return searchParams;
                });
              }}
            >
              <SelectTrigger className='h-8 w-[70px]'>
                <SelectValue placeholder={perpage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1'>1</SelectItem>
                <SelectItem value='2'>2</SelectItem>
                <SelectItem value='3'>3</SelectItem>
              </SelectContent>
            </Select>
          </Form>
          <div className='flex items-center justify-end space-x-2 py-4'>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">Page {page} of {ememos.total_pages}</div>
        {ememos.has_previous && (
          <Button variant='outline' size='sm'>
            <Link to={`?page=${page - 1}${term?`&term=${term}`:""}${perpage?`&perpage=${perpage}`:""}`}>Previous</Link>
          </Button>
        )}
        {ememos.has_next && (
          <Button variant='outline' size='sm'>
            <Link to={`?page=${page + 1}${term?`&term=${term}`:"" }${perpage?`&perpage=${perpage}`:""}`}>Next</Link>
          </Button>
        )}
      </div>
        </div>
      </div>
    </>
  );
}
