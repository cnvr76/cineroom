import type { CameraConfig } from "../../config/config.types";
import * as THREE from "three";
import type { SceneObjectKey } from "../../config/sceneObjects";
import type { IMediaBrief } from "../../services/types/media.types";

export type MoveObjectFnParams = (
  objectKey: SceneObjectKey,
  position: THREE.Vector3Tuple,
  rotation: THREE.Vector3Tuple,
) => void;

export interface SceneState {
  currentSelected: SceneObjectKey | undefined;
  currentHovered: SceneObjectKey | undefined;
  currentMedia: IMediaBrief | undefined;
  currentHoveredMedia: IMediaBrief | undefined;
}

export interface SceneActions {
  selectObject: (key: SceneObjectKey) => void;
  deselectObject: () => void;
  setHovered: (key: SceneObjectKey | undefined) => void;
  isSelected: (key: SceneObjectKey) => boolean;
  isHovered: (key: SceneObjectKey) => boolean;
  isAnyHovered: () => boolean;
  isAnySelected: () => boolean;

  isMediaSelected: () => boolean;
  isMediaHovered: () => boolean;
  selectMedia: (id: string) => void;
  deselectMedia: () => void;
  getMedia: (id: string | undefined) => IMediaBrief | undefined;
  registerMedia: (data: IMediaBrief) => void;
  unregisterAllMedia: () => void;
  setHoveredMedia: (id: string | undefined) => void;

  registerInteractable: (key: string, object: THREE.Object3D) => void;
  registerSpotlight: (key: string, spotlight: THREE.SpotLight) => void;
  getSpotlight: (key: string) => THREE.SpotLight | undefined;
  getInteractable: (key: SceneObjectKey) => THREE.Object3D | undefined;
  getAllInteractables: () => Record<string, THREE.Object3D>;
  getAllSpotlights: () => Record<string, THREE.SpotLight>;
}

export interface SceneAnimations {
  setMoveCameraToFn: (fn: (config: CameraConfig) => void) => void;
  setMoveObjectToFn: (fn: MoveObjectFnParams) => void;
  setResetCameraFn: (fn: () => void) => void;

  getMoveCameraToFn: () => (config: CameraConfig) => void;
  getMoveObjectToFn: () => MoveObjectFnParams;
  getResetCameraFn: () => () => void;
}
