
import { Outlet } from "react-router-dom";


export default function Dashboard() {
//share user data to children



  return (


    <>
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">


      <Outlet  />
      </div>


    </>
  );
}
