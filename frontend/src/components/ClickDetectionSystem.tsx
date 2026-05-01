import { useEffect, useRef } from "react";
import {
  useSceneActions,
  useSceneAnimations,
  useSceneState,
} from "../contexts/SceneContext";
import { useThree } from "@react-three/fiber";
import type { Object3D, Object3DEventMap } from "three";
import type { SceneObjectKey } from "../config/sceneObjects";

const ClickDetectionSystem = ({
  sceneConfig,
}: {
  sceneConfig: Record<string, any>;
}) => {
  const { raycaster, gl, mouse, camera } = useThree();
  const { getAllInteractables, selectObject, isMediaSelected } =
    useSceneActions();
  const { currentSelected } = useSceneState();
  const { getMoveCameraToFn } = useSceneAnimations();

  const isProcessingClick = useRef(false);
  const stateRef = useRef({ currentSelected });
  useEffect(() => {
    stateRef.current.currentSelected = currentSelected;
  }, [currentSelected]);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleClick = (e: MouseEvent) => {
      if (
        stateRef.current.currentSelected ||
        isProcessingClick.current ||
        !isMediaSelected()
      )
        return;

      const interactables = getAllInteractables();
      if (!interactables || Object.keys(interactables).length === 0) return;

      isProcessingClick.current = true;

      raycaster.setFromCamera(mouse, camera);
      const meshes = Object.values(interactables);
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        const hitObject = intersects[0].object;
        let clickedKey: string | undefined = undefined;
        let searchObject: Object3D<Object3DEventMap> | null = hitObject;

        while (searchObject && !clickedKey) {
          clickedKey = Object.keys(interactables).find(
            (key) => interactables[key] === searchObject,
          );
          searchObject = searchObject.parent;
        }

        if (clickedKey && sceneConfig[clickedKey]) {
          const config = sceneConfig[clickedKey].camera?.target;

          const moveCameraTo = getMoveCameraToFn();
          if (moveCameraTo && config) {
            moveCameraTo(config);
            selectObject(clickedKey as SceneObjectKey);
          }
        }
      }

      setTimeout(() => {
        isProcessingClick.current = false;
      }, 200);
    };

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [
    camera,
    raycaster,
    gl,
    mouse,
    getAllInteractables,
    currentSelected,
    sceneConfig,
    selectObject,
    getMoveCameraToFn,
    isMediaSelected,
  ]);

  return null;
};

export default ClickDetectionSystem;
