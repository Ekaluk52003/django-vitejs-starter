
import { useRouteError, isRouteErrorResponse, useLocation, Link  } from "react-router-dom";
import { Button } from "./ui/button";



export default function Errorpage() {

  const location = useLocation()

  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
   
    return (
<div className="flex items-center justify-center h-screen">
  <div className="text-center">
  <h1 className="text-3xl font-bold tracking-tight">Oops! something went wrong 🎯</h1>
  <h2 className="text-3xl font-bold tracking-tight mt-6">{error.status} </h2>
        <p>{error.statusText}</p>
        {error.data?.message && <p>{error.data.message}</p>}
        <Link to={location.pathname}><Button className="mt-4">Go back</Button></Link>
        <div>
        <Link to="/"><Button className="mt-4">Home</Button></Link>
        </div>

  </div>

      </div>
    );
  } else {
    return <h1>Oops! something went wrong</h1>;
  }

}
