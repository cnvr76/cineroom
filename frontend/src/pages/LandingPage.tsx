import { Canvas } from "@react-three/fiber";
import { Gltf, Stats } from "@react-three/drei";
import {
  CAMERA_CONFIG as cc,
  INTERACTABLE_OBJECTS,
} from "../config/sceneObjects";
import {
  CameraFixed,
  CameraSetup,
} from "../components/features/CameraComponents";
import LightingSystem from "../components/features/LightingSystem";
import LandingModal from "../components/landing/LandingModal";
import SpotlightSystem from "../components/features/SpotlightSystem";
import LightningEffect from "../components/features/LightningEffect";
import ScreenMaterialSystem from "../components/features/ScreenMaterialSystem";
import ClickDetectionSystem from "../components/features/ClickDetectionSystem";
import CameraAnimationSystem from "../components/features/CameraAnimationSystem";
import { useSceneActions, useSceneAnimations } from "../contexts/SceneContext";
import TrailerModal from "../components/shared/TrailerModal";

const LandingUI = () => {
  const { isSelected } = useSceneActions();
  const { isAnimating } = useSceneAnimations();
  if (!isSelected("tv")) return <LandingModal />;
  if (!isAnimating && isSelected("tv")) return <TrailerModal />;
  return null;
};

const LandingPage = () => {
  return (
    <div className="w-screen h-screen">
      <Canvas
        camera={{ fov: 50 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        frameloop="always"
      >
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
