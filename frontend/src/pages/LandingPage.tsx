import { Canvas } from "@react-three/fiber";
import { Gltf, Stats } from "@react-three/drei";
import {
  DEFAULT_CAMERA_CONFIG as dcc,
  INTERACTABLE_OBJECTS,
} from "../config/sceneObjects";
import { CameraFixed, CameraSetup } from "../components/CameraComponents";
import LightingSystem from "../components/LightingSystem";
import { useSceneActions, useSceneState } from "../contexts/SceneContext";
import LandingModal from "../components/landing/LandingModal";

const DebugPanel = () => {
  const { currentSelected, currentHovered } = useSceneState();
  const { getAllInteractables, isAnyHovered } = useSceneActions();

  return (
    <div className="fixed right-4 top-4 bg-black/80 text-white p-3 rounded-lg text-sm font-mono z-100">
      <div>Interactables: {Object.keys(getAllInteractables()).join(", ")}</div>
      <div>Selected: {currentSelected || "none"}</div>
      <div>Hovered: {currentHovered || "none"}</div>
      <div>Has hover: {isAnyHovered() ? "yes" : "no"}</div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="w-screen h-screen">
      <DebugPanel />
      <Canvas camera={{ fov: 50 }} dpr={[1, 2]} frameloop="always">
        {/* <CameraSetup /> */}
        {/* <Stats /> */}
        <CameraFixed position={dcc.position} target={dcc.target} />
        <Gltf src="/models/main_scene_old_updated_2.glb" />
        <LightingSystem />
      </Canvas>

      <LandingModal />
    </div>
  );
};

export default LandingPage;
