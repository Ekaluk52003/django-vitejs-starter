import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./layouts/Root";
import { csrfLoader, authLoader, userSelectLoader, EmemoLoader, userLoader, redirectLogin, paginationEmemo } from "./loaders";
import { logoutAction, loginAction, resetPasswordAction, ForgotPasswordAction,  createEmemoAction, editEmemoAction, removeFileAction } from "./actions/index.ts";
import Login from "./page/login";

import ForgotPassword from "./page/ForgotPassword.tsx";
import PasswordReset from "./page/PasswordReset.tsx";
import { Toaster } from "@/components/ui/toaster"
import Dashboard from "./page/Dashboard.tsx";
import Submit from "./page/ememo/submit.tsx";
import Detail from "./page/ememo/detail.tsx";
import Errorpage from "./components/error-page.tsx";
import Allmemo from "./page/ememo/allmemo.tsx";




const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: csrfLoader,
    errorElement:<Errorpage/>,
    id: "authloader",

    children: [
      {
        path: "/login",
        action: loginAction,
        loader:redirectLogin,
        element: <Login />,
      },
      { index: true,
        loader:authLoader,
        element: <App /> },
      {
        path: "password_reset/:email/:token",
        element: <PasswordReset />,
        action:resetPasswordAction

      },
      {
        path: "forgot_password",
        element: <ForgotPassword />,
        action:ForgotPasswordAction

      },
      {
        path: "dashboard",
        element: <Dashboard />,
        loader:authLoader,

        children:[
          {
            path: "/dashboard/ememo/all",
            element: <Allmemo />,
            loader:paginationEmemo
          },
          {
            path: "/dashboard/ememo/new",
            element: <Submit />,
            action: createEmemoAction,
            loader:userSelectLoader
          },
          {
            path: "/dashboard/ememo/:ememo_id",
            element: <Detail />,
            action: editEmemoAction,
            loader:EmemoLoader,
            errorElement:<Errorpage/>

          }

        ]

      },
    ],
  },
{
  path: "/load-user",
  loader: userLoader,
},
{
  path: "/logout",
  action: logoutAction,
},
{
  path: "/remove-file/:ememo_id",
  action: removeFileAction,
},
// {
//   path: "/approve/:ememo_id",
//   action: approveAction,
// },
// {
//   path: "/reject/:ememo_id",
//   action: rejectAction,
// }


]);



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
    <Toaster />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);


