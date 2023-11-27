import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./layouts/Root";
import { csrfLoader, authLoader } from "./loaders";
import { logoutAction, loginAction } from "./actions/index.ts";
import Login from "./page/login";
import ProtectPage from "./page/ProtectPage";
import { Toaster } from "@/components/ui/toaster"





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
        element: <Login />,
      },
      { index: true, element: <App /> },
      {
        path: "protect-route",
        element: <ProtectPage />,
        loader:authLoader

      },
    ],
  },
]);



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
    <Toaster />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);


