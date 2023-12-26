import {
  useLoaderData,
  Form,
  useSearchParams,
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


export default function Allmemo() {
  // @ts-expect-error ignore //

  const { ememos, page, term, perpage } = useLoaderData();

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <Form id='search-form' role='search'>
        <input
          id='term'
          aria-label='Search contacts'
          placeholder='Search'
          type='search'
          name='term'
          defaultValue={term}
        />
        {/* existing code */}
        <button type='submit'>search</button>
      </Form>
      <h2 className='mt-10 mb-10 text-center text-2xl font-bold leading-9'>
        Example of Pagination
      </h2>
      <DataTable
        columns={EmemoColumns}
        data={ememos.results}
        has_previous={ememos.has_previous}
        has_next={ememos.has_next}
        page={page}
        perpage={perpage}
        term={term}
      />
      <div className='flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
        <div className='flex items-center space-x-2'>
          <p className='whitespace-nowrap text-sm font-medium'>Rows per page</p>
          <Form id='search-form' role='search'>
            <Select
              defaultValue='2'
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
        </div>
      </div>
    </>
  );
}
