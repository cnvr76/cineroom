import type {
  CameraConfig,
  InteractableObjectsMap,
  ModalsMap,
} from "./config.types";

export type SceneObjectKey = keyof typeof INTERACTABLE_OBJECTS;
export type SceneModalKey = keyof typeof MODALS;

export const DEFAULT_SELECTED: SceneObjectKey | null = "tv";
export const DEFAULT_MODAL: SceneModalKey | null = "landing";

export const DEFAULT_CAMERA_CONFIG = {
  position: [-0.53, 1.26, 1.09],
  target: [0.5, 1.27, 0.01],
  animationSpeed: 1,
  changeSpeed: 2,
} satisfies CameraConfig;

export const INTERACTABLE_OBJECTS = {
  tv: {
    objectName: "Monitor", // Change later after replacing .glb scene
    camera: DEFAULT_CAMERA_CONFIG,
  },
} satisfies InteractableObjectsMap;

export const MODALS = {
  landing: {
    width: "50%",
    height: "100%",
    inset: "right",
    gap: 16,
    rotation: -16,
    perspective: 1700,
    background: "transparent",
  },
} satisfies ModalsMap;
