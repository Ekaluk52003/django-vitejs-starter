
import { Button } from "@/components/ui/button";
import { Form } from "react-router-dom";
import { useActionData } from "react-router-dom";

export default function ForgotPassword() {
       const data =  useActionData()
  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
    <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
      <h2 className='mt-10 text-center text-2xl font-bold leading-9'>
        You can reset passoword
      </h2>

      <Form method='post' className='px-8 pt-6 pb-8 mb-4'>

        <div className='mb-6'>
          <label className='block text-sm font-bold mb-2'>Enter Email</label>
          <input
            type='email'
            name='email'
            className='w-full border focus:outline-none rounded py-2 px-3 mb-3  text-gray-800'
          />
        </div>


        <Button type='submit' className='w-full'>
          Submit
        </Button>
      </Form>
      { data && data.message ? data.message :""}
      { data && data.error ? data.error :""}
    </div>


  </div>
  )
}
