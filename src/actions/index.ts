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

// @ts-expect-error find out request later //
export const changePasswordAction = async({ request}) => {

  const formData = await request.formData();
  const new_password1 =  formData.get('new_password1')
  formData.append("new_password2",new_password1)

  const  changePasswordForm = Object.fromEntries(formData);
  const reponse = await fetch('/api/v1/auth/change_password', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify(changePasswordForm),
    });
  if(!reponse.ok) {

    return { error :"something wrong"}
  }
  return  { message :"password update"}

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
  const intent = formData.get("intent");
   console.log('intent', intent)
  if(!formData.get('comment')){
    formData.append('comment',"N/A")  }
  const approveForm = Object.fromEntries(formData);

  if(intent == "reject") {
    console.log('hit reject')
 const res = await fetch(`/api/v1/ememo/reject/${params.ememo_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify(approveForm ),
    });

    if( !res.ok)  {
      const data = await res.json()
      // this will return error to action loader
      // return data

      // if you throw err , it will be handle by error page
      throw json(
        { message: data.message  },
        { status: res.status }
      );

    }
    return { ok: true };
  }

  if(intent == "approve") {
    console.log('hit approve')
    const res = await fetch(`/api/v1/ememo/approve/${params.ememo_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify(approveForm ),
    });
  if(!res.ok) {
    const data = await res.json()
    throw json(
      { message: data.message  },
      { status: res.status }
    );
  }
  return { ok: true };
  }


//update only
  const res = await fetch(`/api/v1/ememo/update/${params.ememo_id}`, {
    method: "PUT",
    credentials: "same-origin",
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    body: formData
  });

  if(!res.ok) {
    const data = await res.json()
    throw json(
      { message: data.message  },
      { status: res.status }
    );
  }

  return { success :true}

}



// export const approveAction = async({ request, params}) => {

//   const formData = await request.formData();


//   if(!formData.get('comment')){
//     formData.append('comment',"N/A")
//   }
//   const approveForm = Object.fromEntries(formData);
// // you must convert formdata(aray for request bofy form API) unless api require form data



//   const reponse = await fetch(`/api/v1/ememo/approve/${params.ememo_id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRFToken": cookies.get("csrftoken"),
//       },
//       credentials: "same-origin",
//       body: JSON.stringify(approveForm ),
//     });
//   if(!reponse.ok) {

//     return { error :"something wrong"}
//   }


//   return null

// }

// export const rejectAction = async({ request, params}) => {

//   const formData = await request.formData();


//   if(!formData.get('comment')){
//     formData.append('comment',"N/A")
//   }
//   const approveForm = Object.fromEntries(formData);
// // you must convert formdata(aray for request bofy form API) unless api require form data
//   const response = await fetch(`/api/v1/ememo/reject/${params.ememo_id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRFToken": cookies.get("csrftoken"),
//       },
//       credentials: "same-origin",
//       body: JSON.stringify(approveForm ),
//     });

//     if(!response.ok) {

//       return { error :"something wrong"}
//     }


//   return { success :true}



// }
