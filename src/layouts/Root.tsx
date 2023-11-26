import { Outlet,  Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";




export default function Root() {

  return (
    <div className='relative flex min-h-screen flex-col bg-bgColor text-textColor'>
      <header className='sticky top-0 z-40 w-full border-b'>
        <div className='container flex h-14 items-center space-x-4 sm:justify-between sm:space-x-0'>
          <div className='mr-4 hidden md:flex'>
            <div className='flex gap-6 md:gap-10'>
              <nav className='flex gap-6'>
                <Link to='/'>Home</Link>
              </nav>

              <nav className='flex gap-6'>
                <Link to='/protect-route'>Protect-route</Link>
              </nav>
              <nav className='flex gap-6'>
                <ModeToggle/>
              </nav>
            </div>
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
          <p className='text-center text-sm leading-loose text-muted-foreground md:text-left'>
            Made me{" "}
          </p>
        </div>
      </footer>
    </div>
  );
}
