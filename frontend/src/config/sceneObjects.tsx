import LandingModal from "../components/landing/LandingModal";
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
  position: [1.16, 0.89, 0.47],
  target: [-0.11, 0.36, -0.53],
  animationSpeed: 1,
  changeSpeed: 2,
} satisfies CameraConfig;

export const INTERACTABLE_OBJECTS = {
  tv: {
    objectName: "TV", // Change later after replacing .glb scene
    camera: DEFAULT_CAMERA_CONFIG,
    modal: <LandingModal />,
  },
} satisfies InteractableObjectsMap;

export const MODALS = {
  landing: {
    width: "40%",
    height: "100%",
    inset: "right",
    gap: 16,
    rotation: -16,
    perspective: 1700,
    background: "transparent",
  },
} satisfies ModalsMap;
