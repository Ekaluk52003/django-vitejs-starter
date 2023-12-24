
import { redirect} from "react-router-dom";

export const csrfLoader = async() => {
  const response = await fetch("/api/session/", {
    credentials: "same-origin",
  });
  return response.json();
}

export const redirectLogin = async() => {
  const response = await fetch("/api/v1/auth/me", {
    credentials: "same-origin",
  });
  if (response.ok) {
    return redirect("/");
  }
  return null
}


export const userLoader = async() => {
  const response = await fetch("/api/v1/auth/me", {
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
// @ts-expect-error find out request later //
export const paginationLoader = async ({request}) => {

  const url = new URL(request.url);
  const pageNumber = url.searchParams.get("page") || 1

    const response = await fetch(`/api/v1/paginate-notes?page=${pageNumber}`, {
      credentials: "same-origin",
    });

    const data = await response.json()

  return { notes:data, page:parseInt(pageNumber as string)}

  }

  export const userSelectLoader = async () => {

      const response = await fetch(`/api/v1/users-form`, {
        credentials: "same-origin",
      });

      const data = await response.json()

    return data

    }

    export const EmemoLoader = async ({ request, params }) => {

      const ememo = await fetch(`/api/v1/ememo/${params.ememo_id}`, {
        credentials: "same-origin",
      });

      const users = await fetch(`/api/v1/users-form`, {
        credentials: "same-origin",
      });

      const medias = await fetch(`/api/v1/ememo/media/${params.ememo_id}`, {
        credentials: "same-origin",
      });


      const dataEmomo = await ememo.json()

      const dataUser = await users.json()

      const datamedia =  await medias.json()

    return {
      ememo: dataEmomo,
      user: dataUser,
      medias:  datamedia
    }

    }