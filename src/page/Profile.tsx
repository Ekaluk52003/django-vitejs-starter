import { Button } from "@/components/ui/button";
import { Form, useActionData, useNavigation, useLoaderData } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function Profile() {

  const user = useLoaderData()
  const data = useActionData();
  const navigation = useNavigation();
  const busy = navigation.state === "submitting";

  return (


      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Your Profile
          </h1>
          <p className='text-sm text-muted-foreground'>
            Enter your credential below
          </p>
        </div>

        <Form method='post' className='pt-6 pb-8 mb-4'>
          <label className='block mb-2 text-sm font-bold'>Full Name</label>
          <div className='mb-4'>
            <input
            readOnly
              type='text'
              name='fullname'
              //@ts-expect-error ok to
              value={user.fullname}
              className='w-full px-3 py-2 mb-3 text-gray-800 border rounded focus:outline-none'
            />
          </div>
          <label className='block mb-2 text-sm font-bold'>Title</label>
          <div className='mb-4'>
            <input
            readOnly
              type='text'
              name='jobtitle'
                     //@ts-expect-error ok to
              value={user.jobtitle}
              className='w-full px-3 py-2 mb-3 text-gray-800 border rounded focus:outline-none'
            />
          </div>
          <label className='block mb-2 text-sm font-bold'>Email</label>
          <div className='mb-4'>
            <input
            readOnly
              type='email'
              name='email'
                     //@ts-expect-error ok to
              value={user.email}
              className='w-full px-3 py-2 mb-3 text-gray-800 border rounded focus:outline-none'
            />
          </div>
          <label className='block mb-2 text-sm font-bold'>Old Password</label>
          <div className='mb-4'>
            <input
              type='password'
              name='old_password'
              className='w-full px-3 py-2 mb-3 text-gray-800 border rounded focus:outline-none'
            />
          </div>
          <div className='mb-6'>
            <label className='block mb-2 text-sm font-bold'>New Password</label>
            <input
              type='password'
              name='new_password1'
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
             {/*// @ts-expect-error is ok */}
        {data && data.error ?
              <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
               Make sure old password and new password match
              </AlertDescription>
            </Alert> : ""

          }
           {/*// @ts-expect-error is ok */}
           {data && data.message ?
               <Alert className="text-green-500">
               <CheckCircledIcon className="h-4 w-4 text-green-500" />
               <AlertTitle>Success</AlertTitle>
               <AlertDescription>
                           {/*// @ts-expect-error is ok */}
               {data.message}
               </AlertDescription>
             </Alert> : ""

          }

      </div>

  )
}
