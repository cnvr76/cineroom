import { useRef, useState, type ReactNode } from "react";
import type { MoveObjectFnParams } from "./types/scene.types";
import * as THREE from "three";
import type { CameraConfig } from "../config/config.types";
import {
  INTERACTABLE_OBJECTS,
  DEFAULT_SELECTED,
  type SceneObjectKey,
} from "../config/sceneObjects";
import {
  StateContext,
  ActionsContext,
  AnimationsContext,
} from "./SceneContext";
import type { IMediaBrief } from "../services/types/media.types";

const SceneProvider = ({ children }: { children: ReactNode }) => {
  // --- States of the scene objects ---
  const [currentSelected, setCurrentSelected] = useState<
    SceneObjectKey | undefined
  >(DEFAULT_SELECTED);
  const [currentHovered, setCurrentHovered] = useState<
    SceneObjectKey | undefined
  >(undefined);

  // --- States of the media ---
  const [currentMedia, setCurrentMedia] = useState<IMediaBrief | undefined>(
    undefined,
  );
  const [currentHoveredMedia, setCurrentHoveredMedia] = useState<
    IMediaBrief | undefined
  >(undefined);

  // --- Refs ---
  const interactables = useRef<Record<string, THREE.Object3D>>({});
  const spotlights = useRef<Record<string, THREE.SpotLight>>({});
  const media = useRef<Record<string, IMediaBrief>>({});

  const moveCameraToFn = useRef<(config: CameraConfig) => void>(() => {});
  const resetCameraFn = useRef<() => void>(() => {});
  const moveObjectToFn = useRef<MoveObjectFnParams>(() => {});

  // --- Register functions for scene objects ---
  const selectObject = (key: SceneObjectKey) => {
    if (INTERACTABLE_OBJECTS[key]) setCurrentSelected(key);
  };
  const deselectObject = () => setCurrentSelected(DEFAULT_SELECTED);
  const setHovered = (key: SceneObjectKey | undefined) => {
    setCurrentHovered(key);
  };

  const registerInteractable = (key: string, obj: THREE.Object3D) => {
    interactables.current[key] = obj;
  };
  const registerSpotlight = (key: string, spotlight: THREE.SpotLight) => {
    spotlights.current[key] = spotlight;
  };

  // --- Registed functions for media ---
  const registerMedia = (data: IMediaBrief) => {
    media.current[data._id] = data;
  };
  const getMedia = (id: string | undefined) =>
    id ? media.current[id] : undefined;
  const unregisterAllMedia = () => (media.current = {});
  const isMediaSelected = () => currentMedia !== undefined;
  const isMediaHovered = () => currentHoveredMedia !== undefined;
  const setHoveredMedia = (id: string | undefined) =>
    setCurrentHoveredMedia(getMedia(id));
  const selectMedia = (id: string) => {
    const m = getMedia(id);
    if (m) setCurrentMedia(m);
  };
  const deselectMedia = () => setCurrentMedia(undefined);

  // --- Getters for the scene objects ---
  const getSpotlight = (key: string) => spotlights.current[key];
  const getInteractable = (key: SceneObjectKey) => interactables.current[key];
  const getAllInteractables = () => interactables.current;
  const getAllSpotlights = () => spotlights.current;

  // --- Boolean scene values ---
  const isSelected = (key: SceneObjectKey) => currentSelected === key;
  const isHovered = (key: SceneObjectKey) => currentHovered === key;
  const isAnyHovered = () => currentHovered !== undefined;
  const isAnySelected = () => currentSelected !== undefined;

  // --- Camera functions ---
  const setMoveCameraToFn = (fn: (config: CameraConfig) => void) => {
    moveCameraToFn.current = fn;
  };
  const setResetCameraFn = (fn: () => void) => {
    resetCameraFn.current = fn;
  };

  const getResetCameraFn = () => resetCameraFn.current;
  const getMoveCameraToFn = () => moveCameraToFn.current;

  // TODO - make function to move objects in the scene (for transitions & intros)
  const setMoveObjectToFn = (fn: MoveObjectFnParams) => {
    moveObjectToFn.current = fn;
  };
  const getMoveObjectToFn = () => moveObjectToFn.current;

  return (
    <StateContext.Provider
      value={{
        currentSelected,
        currentHovered,
        currentMedia,
        currentHoveredMedia,
      }}
    >
      <ActionsContext.Provider
        value={{
          // Media
          isMediaHovered,
          isMediaSelected,
          selectMedia,
          deselectMedia,
          registerMedia,
          unregisterAllMedia,
          getMedia,
          setHoveredMedia,
          // Scene objects
          selectObject,
          deselectObject,
          isSelected,
          setHovered,
          isHovered,
          isAnyHovered,
          isAnySelected,
          registerInteractable,
          registerSpotlight,
          getSpotlight,
          getInteractable,
          getAllInteractables,
          getAllSpotlights,
        }}
      >
        <AnimationsContext
          value={{
            setMoveCameraToFn,
            setMoveObjectToFn,
            setResetCameraFn,
            getMoveCameraToFn,
            getMoveObjectToFn,
            getResetCameraFn,
          }}
        >
          {children}
        </AnimationsContext>
      </ActionsContext.Provider>
    </StateContext.Provider>
  );
};

export default SceneProvider;
