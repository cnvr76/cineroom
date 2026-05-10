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
import FavoriteModal from "../components/favorite/FavoriteModal";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MobileNotSupported from "./MobileNotSupported";

const DESKTOP_BREAKPOINT = 1024;

const useDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
};

const LandingUI = () => {
  const [searchParams] = useSearchParams();
  const { isSelected } = useSceneActions();
  const { isAnimating, isCameraReady, getMoveCameraToFn } =
    useSceneAnimations();

  const isFavoriteView = searchParams.get("favorites") === "true";

  useEffect(() => {
    if (!isCameraReady) return;
    if (isFavoriteView) {
      getMoveCameraToFn()(cc.favorite.target);
    } else if (!isSelected("tv")) {
      getMoveCameraToFn()(cc.landing.default);
    }
  }, [isFavoriteView, isCameraReady]);

  if (isSelected("tv")) {
    return !isAnimating ? <TrailerModal /> : null;
  }
  if (isFavoriteView) {
    return <FavoriteModal />;
  }
  return <LandingModal />;
};

const LandingPage = () => {
  const isDesktop = useDesktop();

  if (!isDesktop) return <MobileNotSupported />;

  return (
    <div className="fixed inset-0 overflow-hidden">
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
