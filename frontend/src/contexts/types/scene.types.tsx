import type { RoomConfig } from "../../config/config.types";
import * as THREE from "three";
import type { SceneObjectKey } from "../../config/sceneObjects";

export type MoveObjectFnParams = (
  objectKey: SceneObjectKey,
  position: THREE.Vector3Tuple,
  rotation: THREE.Vector3Tuple,
) => void;

export interface SceneState {
  currentSelected: SceneObjectKey | null;
  currentHovered: SceneObjectKey | null;
}

export interface SceneActions {
  selectObject: (key: SceneObjectKey) => void;
  deselectObject: () => void;
  setHovered: (key: SceneObjectKey | null) => void;
  isSelected: (key: SceneObjectKey) => boolean;
  isHovered: (key: SceneObjectKey) => boolean;
  isAnyHovered: () => boolean;

  registerInteractable: (key: string, object: THREE.Object3D) => void;
  registerSpotlight: (key: string, spotlight: THREE.SpotLight) => void;
  getSpotlight: (key: string) => THREE.SpotLight | undefined;
  getAllInteractables: () => Record<string, THREE.Object3D>;
  getAllSpotlights: () => Record<string, THREE.SpotLight>;

  setMoveCameraToFn: (fn: (key: SceneObjectKey) => void) => void;
  setMoveObjectToFn: (fn: MoveObjectFnParams) => void;
  setResetCameraOfFn: (fn: (room: RoomConfig) => void) => void;
  getMoveCameraToFn: () => (key: SceneObjectKey) => void;
  getResetCameraOfFn: () => (room: RoomConfig) => void;
}
