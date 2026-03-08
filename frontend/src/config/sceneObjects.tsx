import type { CameraConfig, InteractableObjectsMap } from "./config.types";
import type { SceneObjectKey } from "../contexts/types/scene.types";

export const DEFAULT_SELECTED: SceneObjectKey | null = "tv";

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
