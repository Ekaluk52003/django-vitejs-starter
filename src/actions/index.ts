import { redirect} from "react-router-dom";
import Cookies from "universal-cookie";
import { json } from "react-router-dom";
const cookies = new Cookies();

export const logoutAction = async() => {

  await fetch("/api/v1/auth/logout", {
    method:"DELETE",
    credentials: "same-origin",
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
    },
  })

  return redirect("/login");
}

// @ts-expect-error ignore //
export const removeFileAction = async({ params}) => {

  await fetch(`/api/v1/ememo/media/delete/${params.ememo_id}`, {
    method:"DELETE",
    credentials: "same-origin",
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
    },
  })

  return null
}

// @ts-expect-error ignore //
export async function uploadAction({ request }) {

  const formData = await request.formData();

  const file = formData.get("photo");
  formData.append("file", file);

 try { await fetch('/api/v1/upload-note', {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    body:formData,

})}
catch(error) {
  console.log(error)
}
return redirect("/");
}

// @ts-expect-error find out request later //
export const loginAction = async({ request}) => {

  const formData = await request.formData();
  const loginForm = Object.fromEntries(formData);
 const pathname = new URL(request.url).searchParams.get("redirectTo") || "/"
  const reponse = await fetch('/api/v1/auth/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify(loginForm),
    });
  if(!reponse.ok) {

    return { error :"something wrong"}
  }


  return redirect( pathname);

}

// @ts-expect-error find out request later //
export const resetPasswordAction = async({ request}) => {

  const formData = await request.formData();
  const resetPasswordForm = Object.fromEntries(formData);
  const reponse = await fetch('/api/v1/auth/reset_password', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify(resetPasswordForm),
    });
  if(!reponse.ok) {

    return { error :"something wrong"}
  }


  return redirect( '/login');

}

// @ts-expect-error find out request later //
export const ForgotPasswordAction = async({ request}) => {

  const formData = await request.formData();
  const  ForgotPasswordForm = Object.fromEntries(formData);
  const reponse = await fetch('/api/v1/auth/request_password_reset', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify(ForgotPasswordForm),
    });
  if(!reponse.ok) {

    return { error :"something wrong"}
  }
  return  { message :"please check your email"}

}

// @ts-expect-error ignore //
export const createEmemoAction = async({ request}) => {

  const formData = await request.formData();

  const reponse = await fetch(`/api/v1/ememo/create`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    body: formData
  });
 const data = await reponse.json()
 console.log(data)

return redirect(`/dashboard/ememo/${data.number}`)
}

// @ts-expect-error ignore //
export const editEmemoAction = async({ request, params}) => {

  const formData = await request.formData();

 await fetch(`/api/v1/ememo/update/${params.ememo_id}`, {
    method: "PUT",
    credentials: "same-origin",
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    body: formData
  });



  return { success :true}

}

// @ts-expect-error ignore //

export const approveAction = async({ request, params}) => {

  const formData = await request.formData();


  if(!formData.get('comment')){
    formData.append('comment',"N/A")
  }
  const approveForm = Object.fromEntries(formData);
// you must convert formdata(aray for request bofy form API) unless api require form data



  const reponse = await fetch(`/api/v1/ememo/approve/${params.ememo_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify(approveForm ),
    });
  if(!reponse.ok) {

    return { error :"something wrong"}
  }


  return null

}
// @ts-expect-error ignore //
export const rejectAction = async({ request, params}) => {

  const formData = await request.formData();


  if(!formData.get('comment')){
    formData.append('comment',"N/A")
  }
  const approveForm = Object.fromEntries(formData);
// you must convert formdata(aray for request bofy form API) unless api require form data




  const response = await fetch(`/api/v1/ememo/reject/${params.ememo_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify(approveForm ),
    });

  if(!response.ok) {

    throw new Response("something went wrong", { status: 403 });
  }


  return null



}
