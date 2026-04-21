import { useThree } from "@react-three/fiber";
import { useSceneActions } from "../contexts/SceneContext";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { useVideoTexture } from "@react-three/drei";
import {
  CONSTANTS,
  INTERACTABLE_OBJECTS,
  type SceneObjectKey,
} from "../config/sceneObjects";

const useSceneLoader = () => {
  const { scene } = useThree();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { registerInteractable, registerSpotlight, getInteractable } =
    useSceneActions();

  const videoTexture = useVideoTexture("/images/gifs/noise3.mp4", {
    muted: true,
    loop: true,
    autoplay: true,
    playsInline: true,
  });
  // FIXME - change these if needed to place texture correctly
  videoTexture.repeat.set(1, 1);
  videoTexture.offset.set(0, 0);
  // videoTexture.flipY = false;

  useEffect(() => {
    const timer = setTimeout(() => {
      let foundObjects = 0;
      const objectsToAdd: THREE.Object3D[] = [];

      (Object.keys(INTERACTABLE_OBJECTS) as SceneObjectKey[]).forEach((key) => {
        scene.traverse((child) => {
          const interactableObject = INTERACTABLE_OBJECTS[key];
          if (
            child.isObject3D &&
            child.name.includes(interactableObject.objectName)
          ) {
            registerInteractable(key, child);
            foundObjects++;

            const spotlight = new THREE.SpotLight(
              CONSTANTS.SPOTLIGHT_DEFAULT_COLOR,
            );
            spotlight.position.set(
              child.position.x,
              child.position.y + 1,
              child.position.z,
            );
            spotlight.target = child;
            spotlight.castShadow = true;
            spotlight.intensity = 5;
            spotlight.distance = 10;
            spotlight.penumbra = 2;
            spotlight.decay = 1;
            spotlight.angle = Math.PI / 5;

            const spotlightHelper = new THREE.SpotLightHelper(spotlight);
            objectsToAdd.push(spotlight, spotlight.target, spotlightHelper);

            registerSpotlight(key, spotlight);
          }
        });
      });
      objectsToAdd.forEach((obj) => scene.add(obj));

      if (foundObjects === Object.keys(INTERACTABLE_OBJECTS).length) {
        setIsInitialized(true);
      }

      const tvObject = getInteractable("tv");
      if (tvObject) {
        const screenMaterialName = "Screen";
        tvObject.children.forEach((child) => {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.Material;

          if (
            mesh.isMesh &&
            material &&
            material.name.includes(screenMaterialName)
          ) {
            mesh.material = new THREE.MeshBasicMaterial({
              map: videoTexture,
              toneMapped: true,
            });
          }
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [scene, videoTexture, getInteractable]);

  return isInitialized;
};

export default useSceneLoader;
