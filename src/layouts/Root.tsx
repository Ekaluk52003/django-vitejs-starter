import { Outlet, Link, useLoaderData, Form,   NavLink } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";

export default function Root() {
  const session = useLoaderData();


  return (
    <div className='relative flex flex-col min-h-screen bg-bgColor text-textColor'>
      <header className='sticky top-0 z-40 w-full border-b'>
        <div className='container flex items-center space-x-4 h-14 sm:justify-between sm:space-x-0'>
          <div className='mr-4 md:flex'>
            <div className='flex gap-6 md:gap-10'>
              <nav className='flex gap-6'>
                <Link to='/'>Home</Link>
              </nav>

              <NavLink
                    to='protect-route'
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "dark:text-blue-500 font-semibold"
                        : isPending
                        ? "pending"
                        : ""
                    }
                  >
                   Protected-route
                  </NavLink>
                  <NavLink
                    to='pagination'
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "dark:text-blue-500 font-semibold"
                        : isPending
                        ? "pending"
                        : ""
                    }
                  >
                  Pagination
                  </NavLink>
            </div>
          </div>
          <div className='flex items-center  flex-1 space-x-2 justify-end'>
            <ModeToggle />
            {/*// @ts-expect-error i knoew */}
            {session.isAuthenticated ? (
              <Form method='post'>
                <button type='submit'>logout</button>
              </Form>
            ) : (
              <Link to='/login'>Login</Link>
            )}
          </div>
        </div>
      </header>
      <div className='flex-1'>
        <div className='container relative'>
          <Outlet />
        </div>
      </div>
      <footer className='py-6 md:px-8 md:py-0'>
        <div className='container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
          <p className='text-sm leading-loose text-center text-muted-foreground md:text-left'>
          <small className="text-sm font-medium leading-none">Django React Vite</small>
          </p>
        </div>
      </footer>
    </div>
  );
}
