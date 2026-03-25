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
    ui: {
      position: [0, 1.27, -0.05],
      rotation: [0, 0, 0],
      width: 900,
      height: 720,
      content: <div className="">TEST</div>,
    },
  },
} satisfies InteractableObjectsMap;

export const MODALS = {
  landing: {
    width: "50%",
    height: "100%",
    inset: "right",
    gap: 24,
    rotation: -16,
    perspective: 1700,
  },
} satisfies ModalsMap;
