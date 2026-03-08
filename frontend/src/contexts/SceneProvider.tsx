import { useRef, useState, type ReactNode } from "react";
import type { MoveObjectFnParams, SceneObjectKey } from "./types/scene.types";
import * as THREE from "three";
import type { RoomConfig } from "../config/config.types";
import { INTERACTABLE_OBJECTS, DEFAULT_SELECTED } from "../config/sceneObjects";
import { StateContext, ActionsContext } from "./SceneContext";

const SceneProvider = ({ children }: { children: ReactNode }) => {
  const [currentSelected, setCurrentSelected] = useState<SceneObjectKey | null>(
    DEFAULT_SELECTED,
  );
  const [currentHovered, setCurrentHovered] = useState<SceneObjectKey | null>(
    null,
  );

  const interactables = useRef<Record<string, THREE.Object3D>>({});
  const spotlights = useRef<Record<string, THREE.SpotLight>>({});

  const moveCameraToFn = useRef<(objectKey: SceneObjectKey) => void>(() => {});
  const resetCameraOfFn = useRef<(room: RoomConfig) => void>(() => {});
  const moveObjectToFn = useRef<MoveObjectFnParams>(() => {});

  // Register functions for scene objects
  const selectObject = (key: SceneObjectKey) => {
    if (INTERACTABLE_OBJECTS[key]) setCurrentSelected(key);
  };
  const deselectObject = () => setCurrentSelected(DEFAULT_SELECTED);
  const setHovered = (key: SceneObjectKey | null) => setCurrentHovered(key);

  const registerInteractable = (key: string, obj: THREE.Object3D) => {
    interactables.current[key] = obj;
  };
  const registerSpotlight = (key: string, spotlight: THREE.SpotLight) => {
    spotlights.current[key] = spotlight;
  };

  // Getters for the scene objects
  const getSpotlight = (key: string) => spotlights.current[key];
  const getAllInteractables = () => interactables.current;
  const getAllSpotlights = () => spotlights.current;

  // Boolean scene values
  const isSelected = (key: SceneObjectKey) => currentSelected === key;
  const isHovered = (key: SceneObjectKey) => currentHovered === key;
  const isAnyHovered = () => currentHovered !== null;

  // Camera functions
  const setResetCameraOfFn = (fn: (room: RoomConfig) => void) => {
    resetCameraOfFn.current = fn;
  };
  const setMoveCameraToFn = (fn: (key: SceneObjectKey) => void) => {
    moveCameraToFn.current = fn;
  };
  const getResetCameraOfFn = () => resetCameraOfFn.current;
  const getMoveCameraToFn = () => moveCameraToFn.current;

  // TODO - make function to move objects in the scene (for transitions & intros)
  const setMoveObjectToFn = (fn: MoveObjectFnParams) => {
    moveObjectToFn.current = fn;
  };

  return (
    <StateContext.Provider value={{ currentSelected, currentHovered }}>
      <ActionsContext.Provider
        value={{
          selectObject,
          deselectObject,
          isSelected,
          setHovered,
          isHovered,
          isAnyHovered,
          registerInteractable,
          registerSpotlight,
          getSpotlight,
          getAllInteractables,
          getAllSpotlights,
          setMoveCameraToFn,
          setResetCameraOfFn,
          setMoveObjectToFn,
          getResetCameraOfFn,
          getMoveCameraToFn,
        }}
      >
        {children}
      </ActionsContext.Provider>
    </StateContext.Provider>
  );
};

export default SceneProvider;
