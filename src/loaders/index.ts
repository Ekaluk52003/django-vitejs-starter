
import { redirect} from "react-router-dom";


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

// @ts-expect-error ok //
  export const paginationEmemo = async ({request}) => {

    const url = new URL(request.url);
    const pageNumber = url.searchParams.get("page") || 1
    const term = url.searchParams.get("term") || ""
    const perpage = url.searchParams.get("perpage") || 3
    const me = url.searchParams.get("me") || ""
      const response = await fetch(`/api/v1/ememo/pagination/allememo?page=${pageNumber}&term=${term}&perpage=${perpage}&me=${me}`, {
        credentials: "same-origin",
      });

      const data = await response.json()

    return { ememos:data, page:parseInt(pageNumber as string), term:term, perpage:perpage, me:me}

    }

  export const userSelectLoader = async () => {

      const response = await fetch(`/api/v1/users-form`, {
        credentials: "same-origin",
      });

      const data = await response.json()

    return data

    }

    // @ts-expect-error ok //
    export const EmemoLoader = async ({  params }) => {

      const ememo = await fetch(`/api/v1/ememo/${params.ememo_id}`, {
        credentials: "same-origin",
      });

      const users = await fetch(`/api/v1/users-form`, {
        credentials: "same-origin",
      });

      const medias = await fetch(`/api/v1/ememo/media/${params.ememo_id}`, {
        credentials: "same-origin",
      });

      const logs = await fetch(`/api/v1/ememo/log/${params.ememo_id}`, {
        credentials: "same-origin",
      });

      if( !ememo.ok) {
       const reponse = await ememo.json()
        throw Error(reponse.message)
      }

      const dataEmomo = await ememo.json()

      const dataUser = await users.json()

      const datamedia =  await medias.json()

      const dataLog = await logs.json()

    return {
      ememo: dataEmomo,
      user: dataUser,
      medias:  datamedia,
      logs: dataLog
    }

    }