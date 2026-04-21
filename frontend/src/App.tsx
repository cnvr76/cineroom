import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import SceneProvider from "./contexts/SceneProvider";
import LandingPage from "./pages/LandingPage";

const createRoutes = () =>
  createBrowserRouter([
    {
      path: "/",
      element: (
        <SceneProvider>
          <Outlet />
        </SceneProvider>
      ),
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: "auth",
          element: null,
        },
        {
          path: "profile",
          children: [
            {
              path: "me",
              element: null,
            },
            {
              path: "favorite",
              element: null,
            },
          ],
        },
        {
          path: "admin",
          element: null,
        },
      ],
    },
  ]);

function App() {
  const router = createRoutes();

  return <RouterProvider router={router} />;
}

export default App;
