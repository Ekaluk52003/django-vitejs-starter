import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./layouts/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [{ index: true, element: <App /> }],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
