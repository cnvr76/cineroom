import { useRef } from "react";
import * as THREE from "three";
import { useFrame, type RootState } from "@react-three/fiber";
import { CONSTANTS } from "../config/sceneObjects";

const LightningEffect = ({ position }: { position: THREE.Vector3Tuple }) => {
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

  return <directionalLight ref={directionalLightRef} position={position} />;
};

export default LightningEffect;
