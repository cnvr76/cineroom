import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import SceneProvider from "./contexts/SceneProvider";
import LandingPage from "./pages/LandingPage";
import { useSceneActions, useSceneState } from "./contexts/SceneContext";
import AuthPage from "./pages/AuthPage";
import AuthProvider from "./contexts/AuthProvider";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";

const DebugPanel = () => {
  const { currentSelected, currentHovered, currentHoveredMedia, currentMedia } =
    useSceneState();
  const { getAllInteractables, isAnyHovered, isAnySelected } =
    useSceneActions();

  return (
    <div className="fixed right-4 top-4 bg-black/80 text-white p-3 rounded-lg text-sm font-mono z-30000">
      <div>Interactables: {Object.keys(getAllInteractables()).join(", ")}</div>
      <div>Selected: {currentSelected || "none"}</div>
      <div>Hovered: {currentHovered || "none"}</div>
      <div>Has hover: {isAnyHovered() ? "yes" : "no"}</div>
      <div>Has selection: {isAnySelected() ? "yes" : "no"}</div>
      <div>Hovered media: {currentHoveredMedia?.title || "none"}</div>
      <div>Selected media: {currentMedia?.title || "none"}</div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SceneProvider>
        <AuthProvider>
          {/* {import.meta.env.DEV && <DebugPanel />} */}
          <Outlet />
        </AuthProvider>
      </SceneProvider>
    ),
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "profile",
        children: [
          {
            path: "me",
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
