import { redirect} from "react-router-dom";
import Cookies from "universal-cookie";


const cookies = new Cookies();

export const logoutAction = async() => {
  await fetch("/api/logout/", {
    credentials: "same-origin",
  })

  return redirect("/login");
}

// @ts-expect-error find out request later //
export const loginAction = async({ request}) => {

  const formData = await request.formData();
  const loginForm = Object.fromEntries(formData);
 const pathname = new URL(request.url).searchParams.get("redirectTo") || "/"
  const reponse = await fetch('/api/login/', {
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