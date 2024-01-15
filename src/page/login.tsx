import { Link, Form, useActionData, useNavigation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

export default function Login() {
  const data = useActionData();
  const navigation = useNavigation();
  const busy = navigation.state === "submitting";
  return (
    <>
      <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
          <div className='absolute inset-0 bg-zinc-900' />
          <div className='relative z-20 flex items-center text-lg font-medium'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='mr-2 h-6 w-6'
            >
              <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
            </svg>
            Logo
          </div>
          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg'>
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className='text-sm'>Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className='p-4 lg:p-8 h-full flex items-center'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Log in to account
              </h1>
              <p className='text-sm text-muted-foreground'>
                Enter your credential below
              </p>
            </div>
            <Form method='post' className='pt-6 pb-8 mb-4'>
              <label className='block mb-2 text-sm font-bold'>Email</label>
              <div className='mb-4'>
                <input
                  type='email'
                  name='email'
                  className='w-full px-3 py-2 mb-3 text-gray-800 border rounded focus:outline-none'
                />
              </div>
              <div className='mb-6'>
                <label className='block mb-2 text-sm font-bold'>Password</label>
                <input
                  type='password'
                  name='password'
                  className='w-full px-3 py-2 mb-3 text-gray-800 border rounded focus:outline-none'
                />
              </div>

              {busy ? (
                <Button disabled className='w-full'>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Please wait
                </Button>
              ) : (
                <Button type='submit' className='w-full'>
                  Submit
                </Button>
              )}
            </Form>
            {/*@ts-expect-error ok to error */}
            {data && data.error && (
              <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
               Make sure user email and password is correct
              </AlertDescription>
            </Alert>
            )}
            <p className='px-8 text-center text-sm text-muted-foreground'>
              <Link
                to='/forgot_password'
                className='flex justify-center text-base'
              >
                Forgot Password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
