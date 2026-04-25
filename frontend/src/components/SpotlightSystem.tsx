import { useThree, useFrame, type RootState } from "@react-three/fiber";
import useSceneLoader from "../hooks/useSceneLoader";
import { useEffect, useState } from "react";
import { useSceneActions, useSceneState } from "../contexts/SceneContext";
import * as THREE from "three";
import { CONSTANTS, type SceneObjectKey } from "../config/sceneObjects";

const SpotlightSystem = () => {
  const { raycaster, camera, mouse } = useThree();
  const isInitialized = useSceneLoader();
  const [interactionsEnabled, setInteractionsEnabled] =
    useState<boolean>(false);
  const { currentHovered } = useSceneState();
  const {
    setHovered,
    isAnyHovered,
    isAnySelected,
    getSpotlight,
    getAllInteractables,
    getAllSpotlights,
  } = useSceneActions();

  useEffect(() => {
    if (isInitialized) {
      setHovered(undefined);
      const timer = setTimeout(() => {
        Object.values(getAllSpotlights()).forEach((spotlight) => {
          if (spotlight) spotlight.intensity = 0;
        });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, getAllSpotlights, setHovered]);

  useEffect(() => {
    const activateInteractibles = () => {
      setInteractionsEnabled(true);
      window.removeEventListener("pointermove", activateInteractibles);
    };
    window.addEventListener("pointermove", activateInteractibles);
    return () =>
      window.removeEventListener("pointermove", activateInteractibles);
  }, []);

  useFrame((state: RootState, delta: number) => {
    if (!interactionsEnabled || !isInitialized) return;
    if (document.hidden) return;

    const interactables = getAllInteractables();

    raycaster.setFromCamera(mouse, camera);
    const meshes = Object.values(interactables);

    if (meshes.length === 0) return;

    const intersects = raycaster.intersectObjects(meshes, true);

    let newHovered: string | undefined = undefined;
    if (intersects.length > 0) {
      const hitObject = intersects[0].object;

      let searchObject: THREE.Object3D | null = hitObject;
      while (searchObject && !newHovered) {
        newHovered = Object.keys(interactables).find(
          (key) => interactables[key] === searchObject,
        );
        searchObject = searchObject.parent;
      }
    }

    if (newHovered !== currentHovered && !isAnySelected()) {
      setHovered(newHovered as SceneObjectKey);
    }

    document.body.style.cursor =
      isAnyHovered() && !isAnySelected() ? "pointer" : "default";

    const k = 6;
    const clampedDelta = Math.min(delta, 1 / 30);

    Object.keys(getAllSpotlights()).forEach((key) => {
      const spotlight = getSpotlight(key);

      if (spotlight) {
        const isHovered = currentHovered === key;
        const targetIntensity = isHovered
          ? CONSTANTS.SPOTLIGHT_MAX_INTENSITY
          : 0;

        spotlight.intensity = THREE.MathUtils.lerp(
          spotlight.intensity,
          targetIntensity,
          clampedDelta * k,
        );
      }
    });
  });

  return null;
};

export default SpotlightSystem;
