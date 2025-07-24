import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import { AuthProvider } from "../src/auth/authContext";

import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/admin/Admin";
import Login from "./pages/login/Login";
import Profil from "./pages/profil/Profil";
import About from "./pages/about/About";
import ErrorPage from "./pages/errorpage/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "profil", element: <Profil /> },
      { path: "about", element: <About /> },
      { path: "*", element: <ErrorPage /> },
      { path: "login", element: <Login /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
