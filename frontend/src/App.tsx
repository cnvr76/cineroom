import SceneProvider from "./contexts/SceneProvider";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <SceneProvider>
      <LandingPage />
    </SceneProvider>
  );
}

export default App;
