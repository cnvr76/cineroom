import { Canvas } from "@react-three/fiber";
import { Gltf, Stats } from "@react-three/drei";
import { DEFAULT_CAMERA_CONFIG as dcc } from "../config/sceneObjects";
import { CameraFixed, CameraSetup } from "../components/CameraComponents";
import LightingSystem from "../components/LightingSystem";
import LandingModal from "../components/landing/LandingModal";
import SpotlightSystem from "../components/SpotlightSystem";
import LightningEffect from "../components/LightningEffect";
import ScreenMaterialSystem from "../components/ScreenMaterialSystem";

const LandingPage = () => {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ fov: 50 }} dpr={[1, 2]} frameloop="always">
        {/* <CameraSetup /> */}
        {/* <Stats /> */}
        <CameraFixed position={dcc.position} target={dcc.target} />
        <Gltf src="/models/scene.glb" />
        <LightingSystem />
        <LightningEffect position={[-2.8, -0.4, -4.2]} />
        <SpotlightSystem />
        <ScreenMaterialSystem />
      </Canvas>

      <LandingModal />
    </div>
  );
};

export default LandingPage;
