import { Outlet, useLocation,    } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";

import Header from "./header";
import Sidebar from "./sidebar";

export default function Root() {


  const {pathname} = useLocation();

  const noHeaderSidebarRoute = pathname.split('/')[1] == "login" ||  pathname.split('/')[1] == "forgot_password" || pathname.split('/')[1] == "password_reset" 



  return (
    <>
    {!noHeaderSidebarRoute  && <Header /> }

      <div className='flex h-screen overflow-hidden'>
      {!noHeaderSidebarRoute &&  <Sidebar className='w-1/6 hidden md:block' /> }

        <Toaster />
        <main className={`flex-1 ${!noHeaderSidebarRoute && 'pt-16 overflow-x-hidden overflow-y-auto' }`}>
          <Outlet />

        </main>

      </div>

    </>
  );
}
