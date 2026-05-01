import { Canvas } from "@react-three/fiber";
import { Gltf, Stats } from "@react-three/drei";
import {
  CAMERA_CONFIG as cc,
  INTERACTABLE_OBJECTS,
} from "../config/sceneObjects";
import { CameraFixed, CameraSetup } from "../components/CameraComponents";
import LightingSystem from "../components/LightingSystem";
import LandingModal from "../components/landing/LandingModal";
import SpotlightSystem from "../components/SpotlightSystem";
import LightningEffect from "../components/LightningEffect";
import ScreenMaterialSystem from "../components/ScreenMaterialSystem";
import ClickDetectionSystem from "../components/ClickDetectionSystem";
import CameraAnimationSystem from "../components/CameraAnimationSystem";
import { useSceneActions } from "../contexts/SceneContext";

const LandingUI = () => {
  const { isSelected } = useSceneActions();
  return !isSelected("tv") ? <LandingModal /> : null;
};

const LandingPage = () => {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ fov: 50 }} dpr={[1, 2]} frameloop="always">
        {/* <CameraSetup /> */}
        {/* <Stats /> */}
        <CameraFixed
          position={cc.landing.default.position}
          target={cc.landing.default.target}
        />
        <Gltf src="/models/scene.glb" />

        <LightingSystem />
        <LightningEffect position={[-2.8, -0.4, -4.2]} />
        <SpotlightSystem />

        <ScreenMaterialSystem />

        <CameraAnimationSystem
          defaultConfig={INTERACTABLE_OBJECTS.tv.camera.default}
        />
        <ClickDetectionSystem sceneConfig={INTERACTABLE_OBJECTS} />
      </Canvas>

      <LandingUI />
    </div>
  );
};

export default LandingPage;
