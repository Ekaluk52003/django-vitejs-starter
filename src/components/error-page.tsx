
import { useRouteError, isRouteErrorResponse, useLocation, Link  } from "react-router-dom";
import { Button } from "./ui/button";



export default function Errorpage() {

  const location = useLocation()
  
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="text-center mt-5">
        <h1>Oops! something went wrong</h1>
        <h2>{error.status}</h2>
        <p>{error.statusText}</p>
        {error.data?.message && <p>{error.data.message}</p>}
        <Link to={location.pathname}><Button>Go back</Button></Link>
      </div>
    );
  } else {
    return <h1>Oops! something went wrong</h1>;
  }

}
