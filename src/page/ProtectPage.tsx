import { Outlet } from "react-router-dom"






export default function ProtectRoot() {
  return (
    <>
  <section className='flex max-w-[980px] flex-col items-start gap-2 px-4 pt-8 md:pt-12 page-header pb-8'>
      <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
        Protected Route
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        This is protected route by Django Session
      </p>
    </section>
    <Outlet/>
    </>

  )
}
