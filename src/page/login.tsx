import { Button } from "@/components/ui/button";
import { Form, useActionData, useNavigation } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Login() {
  const data = useActionData();
  const navigation = useNavigation();
  const busy = navigation.state === "submitting";

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9'>
          Sign in to your account
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <Form method='post' className='px-8 pt-6 pb-8 mb-4'>
          <label className='block text-sm font-bold mb-2'>Username</label>
          <div className='mb-4'>
            <input
              type='username'
              name='username'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div className='mb-6'>
            <label className='block text-sm font-bold mb-2'>Password</label>
            <input
              type='password'
              name='password'
              className='shadow appearance-none w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>

          {busy ? (
            <Button disabled className='w-full'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button type='submit' className='w-full'>
              Submit
            </Button>
          )}
        </Form>

        {data && data.error && (
          <h5 className='text-lg text-red-700'>{data.error}</h5>
        )}
      </div>
    </div>
  );
}
