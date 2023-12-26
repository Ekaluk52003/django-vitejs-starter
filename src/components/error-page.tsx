
import { useRouteError } from "react-router-dom";
export default function Errorpage() {
  const error = useRouteError();

  return (

    // Uncaught ReferenceError: path is not defined
<div>Dang! {error.message} </div>
  )
}
