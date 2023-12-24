import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./layouts/Root";
import { csrfLoader, authLoader, paginationLoader, userSelectLoader, EmemoLoader, userLoader, redirectLogin } from "./loaders";
import { logoutAction, loginAction, uploadAction, resetPasswordAction, ForgotPasswordAction,  createEmemoAction, editEmemoAction, removeFileAction } from "./actions/index.ts";
import Login from "./page/login";
import ProtectPage from "./page/ProtectPage";
import ForgotPassword from "./page/ForgotPassword.tsx";
import PasswordReset from "./page/PasswordReset.tsx";
import { Toaster } from "@/components/ui/toaster"
import Pagination from "./page/Pagination.tsx";
import Dashboard from "./page/Dashboard.tsx";
import Submit from "./page/ememo/submit.tsx";
import Detail from "./page/ememo/detail.tsx";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: csrfLoader,
    action: logoutAction,

    children: [
      {
        path: "/login",
        action: loginAction,
        loader:redirectLogin,
        element: <Login />,
      },
      { index: true, element: <App /> },
      {
        path: "protect-route",
        element: <ProtectPage />,
        action:uploadAction,
        loader:authLoader,


      },
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
        path: "pagination",
        element: <Pagination />,
        loader: paginationLoader

      },
      {
        path: "dashboard",
        element: <Dashboard />,
        loader:authLoader,
        children:[
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
            loader:EmemoLoader
          },

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
}

]);



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
    <Toaster />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);


