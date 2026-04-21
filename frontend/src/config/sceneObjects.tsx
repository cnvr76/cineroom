import LandingModal from "../components/landing/LandingModal";
import type {
  CameraConfig,
  InteractableObjectsMap,
  ModalsMap,
} from "./config.types";

export type SceneObjectKey = keyof typeof INTERACTABLE_OBJECTS;
export type SceneModalKey = keyof typeof MODALS;

export const DEFAULT_SELECTED: SceneObjectKey | undefined = undefined;
export const DEFAULT_MODAL: SceneModalKey | null = "landing";

export const DEFAULT_CAMERA_CONFIG = {
  position: [0.74, 0.87, 0.39],
  target: [-0.31, 0.21, -0.39],
  animationSpeed: 1,
  changeSpeed: 2,
} satisfies CameraConfig;

export const INTERACTABLE_OBJECTS = {
  tv: {
    objectName: "TV",
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

export const CONSTANTS: Record<string, any> = {
  AMBIENT_LIGHT_INTENSITY: 2.5,

  MAX_DIRECTIONAL_LIGHT_INTENSITY: 3,
  MIN_DIRECTIONAL_LIGHT_INTENSITY: 0.01,
  LIGHTNING_CHANCE_PERCENT: 1,
  LIGHTNING_FADE_SPEED: 10,

  SPOTLIGHT_MAX_INTENSITY: 10,
  SPOTLIGHT_DEFAULT_COLOR: 0xdbf4ff,
};
