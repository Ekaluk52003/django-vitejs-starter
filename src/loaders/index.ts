
import { redirect} from "react-router-dom";

export const csrfLoader = async() => {
  const response = await fetch("/api/session/", {
    credentials: "same-origin",
  });
  return response.json();
}

// @ts-expect-error ignore //
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

export const paginationLoader = async ({request}) => {

  const url = new URL(request.url);
  const pageNumber = url.searchParams.get("page") || 1

    const response = await fetch(`/api/v1/paginate-notes?page=${pageNumber}`, {
      credentials: "same-origin",
    });

    const data = await response.json()

  return { notes:data, page:parseInt(pageNumber as string)}

  }