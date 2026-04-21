import { useFrame, type RootState } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { CONSTANTS } from "../config/sceneObjects";
import { useSceneActions } from "../contexts/SceneContext";

const LightingSystem = () => {
  const { isAnyHovered, isAnySelected } = useSceneActions();

  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state: RootState, delta: number) => {
    if (!directionalLightRef.current) return;
    if (document.hidden) return;

    if (Math.random() > (100 - CONSTANTS.LIGHTNING_CHANCE_PERCENT) / 100) {
      directionalLightRef.current.intensity =
        CONSTANTS.MAX_DIRECTIONAL_LIGHT_INTENSITY * (0.5 + Math.random() * 0.5);
    } else {
      directionalLightRef.current.intensity = THREE.MathUtils.lerp(
        directionalLightRef.current.intensity,
        CONSTANTS.MIN_DIRECTIONAL_LIGHT_INTENSITY,
        delta * CONSTANTS.LIGHTNING_FADE_SPEED,
      );
    }
  });

  useFrame((state: RootState, delta: number) => {
    if (!ambientLightRef.current) return;

    const clampedDelta = Math.min(delta, 1 / 30);
    const targetAmbient =
      isAnyHovered() || isAnySelected()
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
    <>
      <ambientLight
        ref={ambientLightRef}
        intensity={CONSTANTS.AMBIENT_LIGHT_INTENSITY}
      />

      <directionalLight
        ref={directionalLightRef}
        position={[-2.8, -0.4, -4.2]}
      />
    </>
  );
};

export default LightingSystem;
