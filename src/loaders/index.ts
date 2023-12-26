
import { redirect} from "react-router-dom";

// export const csrfLoader = async() => {
//   const response = await fetch("/api/session/", {
//     credentials: "same-origin",
//   });
//   return response.json();
// }


export const csrfLoader = async() => {
   await fetch("/api/v1/auth/csrf", {
    method:"POST",
    credentials: "same-origin",
  });

  const user = await fetch("/api/v1/auth/me", {
    credentials: "same-origin",
  });


  return user.json();


}

export const redirectLogin = async() => {
  const response = await fetch("/api/v1/auth/me", {
    credentials: "same-origin",
  });
  if (response.ok) {
    return redirect("/");
  }

  return {user:null}
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
  const response = await fetch("/api/v1/auth/me", {
    credentials: "same-origin",
  });


if(!response.ok) {
  return redirect(`/login?redirectTo=${pathname}`);
}

return response.json();



}
// @ts-expect-error find out request later //
export const paginationLoader = async ({request}) => {

  const url = new URL(request.url);
  const pageNumber = url.searchParams.get("page") || 1
  const term = url.searchParams.get("term") || ""
  const perpage = url.searchParams.get("perpage") || 3

    const response = await fetch(`/api/v1/paginate-notes?page=${pageNumber}&term=${term}&perpage=${perpage}`, {
      credentials: "same-origin",
    });

    const data = await response.json()

  return { notes:data, page:parseInt(pageNumber as string), term:term, perpage:perpage}

  }

  export const paginationEmemo = async ({request}) => {

    const url = new URL(request.url);
    const pageNumber = url.searchParams.get("page") || 1
    const term = url.searchParams.get("term") || ""
    const perpage = url.searchParams.get("perpage") || 3

      const response = await fetch(`/api/v1/ememo/pagination/allememo?page=${pageNumber}&term=${term}&perpage=${perpage}`, {
        credentials: "same-origin",
      });

      const data = await response.json()

    return { ememos:data, page:parseInt(pageNumber as string), term:term, perpage:perpage}

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

      if( !ememo.ok) {
       const reponse = await ememo.json()
        throw Error(reponse.message)
      }

      const dataEmomo = await ememo.json()

      const dataUser = await users.json()

      const datamedia =  await medias.json()

    return {
      ememo: dataEmomo,
      user: dataUser,
      medias:  datamedia
    }

    }