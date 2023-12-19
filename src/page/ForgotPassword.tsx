
import { Button } from "@/components/ui/button";
import { Form } from "react-router-dom";
// import { useActionData } from "react-router-dom";

export default function ForgotPassword() {
      //  const data =  useActionData()
  return (
    <div className='flex flex-col justify-center min-h-full px-6 py-12 lg:px-8'>
    <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
      <h2 className='mt-10 text-2xl font-bold leading-9 text-center'>
        You can reset passoword
      </h2>

      <Form method='post' className='px-8 pt-6 pb-8 mb-4'>

        <div className='mb-6'>
          <label className='block mb-2 text-sm font-bold'>Enter Email</label>
          <input
            type='email'
            name='email'
            className='w-full px-3 py-2 mb-3 text-gray-800 border rounded focus:outline-none'
          />
        </div>


        <Button type='submit' className='w-full'>
          Submit
        </Button>
      </Form>
      {/* { data && data.message ? data.message :""}
      { data && data.error ? data.error :""} */}
    </div>


  </div>
  )
}
