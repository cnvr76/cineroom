import type { Vector3Tuple, Vector4Tuple } from "three";
import type { ReactNode } from "react";
import type { ModalPlacement } from "../components/types/components.types";

export type CameraConfig = {
  position: Vector3Tuple;
  target: Vector3Tuple;
  quaternion?: Vector4Tuple;
  animationSpeed: number;
  changeSpeed?: number;
};
type CameraConfigObject = {
  default: CameraConfig;
  target?: CameraConfig;
};

export type UIConfig = {
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  width: number;
  height: number;
  content: ReactNode;
};

export type InteractableObject = {
  objectName: string;
  camera: CameraConfigObject;
  modal?: ReactNode;
  func?: void;
};

export type InteractableObjectsMap = Record<string, InteractableObject>;
export type ModalsMap = Record<string, ModalPlacement>;
export type CameraConfigMap = Record<string, CameraConfigObject>;
