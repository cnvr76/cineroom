import { useFrame, type RootState } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { CONSTANTS } from "../config/sceneObjects";
import { useSceneActions, useSceneState } from "../contexts/SceneContext";

const LightingSystem = () => {
  const { isAnyHovered, isAnySelected } = useSceneActions();
  const { currentHoveredMedia } = useSceneState();

  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  useFrame((state: RootState, delta: number) => {
    if (!ambientLightRef.current) return;

    const clampedDelta = Math.min(delta, 1 / 30);
    const targetAmbient =
      isAnyHovered() || isAnySelected() || currentHoveredMedia !== undefined
        ? 0.2
        : CONSTANTS.AMBIENT_LIGHT_INTENSITY;
    const k = 6;

    ambientLightRef.current.intensity = THREE.MathUtils.lerp(
      ambientLightRef.current.intensity,
      targetAmbient,
      clampedDelta * k,
    );
  });

  return (
    <ambientLight
      ref={ambientLightRef}
      intensity={CONSTANTS.AMBIENT_LIGHT_INTENSITY}
    />
  );
};

export default LightingSystem;
