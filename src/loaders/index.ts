
import { redirect} from "react-router-dom";

export const csrfLoader = async() => {
  const response = await fetch("/api/session/", {
    credentials: "same-origin",
  });
  return response.json();
}


export const authLoader = async ({request}) => {
const pathname = new URL(request.url).pathname
  const response = await fetch("/api/session/", {
    credentials: "same-origin",
  });

const {isAuthenticated} = await response.json()


if(!isAuthenticated) {
return redirect(`/login?redirectTo=${pathname}`);

}

return null

}