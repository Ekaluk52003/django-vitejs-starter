import { redirect} from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const logoutAction = async() => {
  await fetch("/api/logout/", {
    credentials: "same-origin",
  })

  return redirect("/login");
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


export const createEmemoAction = async({ request}) => {


  const formData = await request.formData();

  const files = formData.get("file");
  
  formData.append("file", files[1]);
  // Object.entries(files).forEach(([key, value]) => {
  //   formData.append(key, value);
  // });



//  try { await fetch('/api/v1/ememo/create', {
//     method: "POST",
//     credentials: "same-origin",
//     headers: {
//       "X-CSRFToken": cookies.get("csrftoken"),
//     },
//     body:formData,

// })}
// catch(error) {
//   console.log(error)
// }
// return redirect("/");
}

export const editEmemoAction = async({ request, params}) => {

  const formData = await request.formData();

  const ememoForm = Object.fromEntries(formData);


  const reponse = await fetch(`/api/v1/ememo/save/${params.ememo_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify(ememoForm),
    });
  if(!reponse.ok) {

    return { error :"something wrong"}
  }


  return { success :true}

}