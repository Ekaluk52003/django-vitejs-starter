import { Button } from "@/components/ui/button";
import { Outlet } from "react-router-dom";
import { Form } from "react-router-dom";
import  { useState } from 'react';

import { Loader2 } from "lucide-react"



export default function ProtectRoot() {

  const [loading, setloading] = useState(false);
  const [error,   setError] = useState('');


    const  handleClick = async (event) => {
      setloading(true)
      event.preventDefault()
      await fetch('/api/v1/pdf', {
        credentials: "same-origin"
    }).then((response) => response.blob()).then((blob) => {

        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "abc.pdf");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        setloading(false)}).catch((error) => {
        error.json().then((json) => {
             setError(json)
            setloading(false)
        })
      });
    }



  return (
    <>
      <section className='flex max-w-[980px] flex-col items-start gap-2 px-4 pt-8 md:pt-12 page-header pb-8'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
          Protected Route
        </h1>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>
          This is protected route by Django Session
        </p>
        {loading ? <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>: <Button onClick={handleClick}>
      Download pdf
    </Button>}



      </section>

      <Form method='post' className='px-8 pt-6 pb-8 mb-4' encType="multipart/form-data">
        <label className='block text-sm font-bold mb-2'>title</label>
        <div className='mb-4'>
          <input
            type='text'
            name='title'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-6'>
          <label className='block text-sm font-bold mb-2'>Content</label>
          <input
            type='text'
            name='content'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />

          <input
            type='file'
            name='photo'
            className='shadow appearance-none w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <Button type="submit">Submit</Button>
      </Form>
      <Outlet />
    </>
  );
}
