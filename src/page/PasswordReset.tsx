import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "react-router-dom";

export default function PasswordReset() {
  const { token, email } = useParams();

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9'>
          You can reset passoword
        </h2>

        <Form method='post' className='px-8 pt-6 pb-8 mb-4'>

          <div className='mb-4'>
            <input
              type='hidden'
              name='email'
              value={email}
            />
          </div>
          <div className='mb-6'>
            <input
              type='hidden'
              name='token'
              value={token}
            />
          </div>
          <div className='mb-6'>
            <label className='block text-sm font-bold mb-2'>Enter New Password</label>
            <input
              type='password'
              name='new_password1'
              className='w-full border focus:outline-none rounded py-2 px-3 mb-3  text-gray-800'
            />
          </div>
          <div className='mb-6'>
            <label className='block text-sm font-bold mb-2'>Reconfirm New Password</label>
            <input
              type='password'
              name='new_password2'
              className='w-full border focus:outline-none rounded py-2 px-3 mb-3  text-gray-800'
            />
          </div>

          <Button type='submit' className='w-full'>
            Submit
          </Button>
        </Form>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'></div>
    </div>
  );
}
