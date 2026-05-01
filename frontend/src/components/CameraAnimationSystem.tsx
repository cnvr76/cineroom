import { useFrame, useThree } from "@react-three/fiber";
import type { CameraConfig } from "../config/config.types";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useSceneActions, useSceneAnimations } from "../contexts/SceneContext";

const CameraAnimationSystem = ({
  defaultConfig,
}: {
  defaultConfig: CameraConfig;
}) => {
  const { camera } = useThree();
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const targetPosition = useRef(new THREE.Vector3());
  const targetTarget = useRef(new THREE.Vector3());
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));

  const animationDuration = useRef(2);

  const { setMoveCameraToFn, setResetCameraFn } = useSceneAnimations();
  const { deselectObject } = useSceneActions();

  useEffect(() => {
    camera.position.set(...defaultConfig.position);
    currentTarget.current.set(...defaultConfig.target);
    camera.lookAt(currentTarget.current);
  }, [camera, defaultConfig]);

  const animateToPosition = useCallback((config: CameraConfig) => {
    targetPosition.current.set(...config.position);
    targetTarget.current.set(...config.target);
    animationDuration.current = config.animationSpeed || 2;
    setIsAnimating(true);
  }, []);

  const animateToDefault = useCallback(() => {
    animateToPosition(defaultConfig);
    deselectObject();
  }, []);

  useEffect(() => {
    setMoveCameraToFn(animateToPosition);
    setResetCameraFn(animateToDefault);
  }, [
    animateToDefault,
    animateToPosition,
    setMoveCameraToFn,
    setResetCameraFn,
  ]);

  useFrame((_, delta: number) => {
    if (!isAnimating || document.hidden) return;

    const clampedDelta = Math.min(delta, 1 / 30);
    const speed = animationDuration.current;

    camera.position.lerp(targetPosition.current, clampedDelta * speed);
    currentTarget.current.lerp(targetTarget.current, clampedDelta * speed);
    camera.lookAt(currentTarget.current);

    const posDist = camera.position.distanceTo(targetPosition.current);
    const lookDist = currentTarget.current.distanceTo(targetTarget.current);
    if (posDist < 0.01 && lookDist < 0.01) {
      setIsAnimating(false);
    }
  });

  return null;
};

export default CameraAnimationSystem;
