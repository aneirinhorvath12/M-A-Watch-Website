import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppShell from "./layout/AppShell";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import About from "./pages/About";
import Apply from "./pages/Apply";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: "reports", element: <Reports /> },
      { path: "reports/:slug", element: <ReportDetail /> },
      { path: "about", element: <About /> },
      { path: "apply", element: <Apply /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
