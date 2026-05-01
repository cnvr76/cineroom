import { useThree, useFrame, type RootState } from "@react-three/fiber";
import useSceneLoader from "../hooks/useSceneLoader";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSceneActions, useSceneState } from "../contexts/SceneContext";
import * as THREE from "three";
import { CONSTANTS, type SceneObjectKey } from "../config/sceneObjects";

// --- Raycast throttle: 30Hz max, only when pointer actually moved ---
const RAYCAST_INTERVAL_MS = 33;

const SpotlightSystem = () => {
  const { raycaster, camera, mouse } = useThree();
  const isInitialized = useSceneLoader();
  const [interactionsEnabled, setInteractionsEnabled] =
    useState<boolean>(false);
  const { currentHovered, currentHoveredMedia, currentMedia } = useSceneState();
  const {
    setHovered,
    isAnyHovered,
    isAnySelected,
    isHovered,
    getSpotlight,
    getAllInteractables,
    getAllSpotlights,
  } = useSceneActions();
  const tempColor = useMemo(() => new THREE.Color(), []);

  // --- Refs for raycast / cursor throttling ---
  const pointerMovedRef = useRef<boolean>(true);
  const lastRaycastRef = useRef<number>(0);
  const cursorRef = useRef<string>("default");

  useEffect(() => {
    if (isInitialized) {
      setHovered(undefined);
      const timer = setTimeout(() => {
        Object.values(getAllSpotlights()).forEach((spotlight) => {
          if (spotlight) spotlight.intensity = 0;
        });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, getAllSpotlights, setHovered]);

  useEffect(() => {
    const activateInteractibles = () => {
      setInteractionsEnabled(true);
      window.removeEventListener("pointermove", activateInteractibles);
    };
    window.addEventListener("pointermove", activateInteractibles);
    return () =>
      window.removeEventListener("pointermove", activateInteractibles);
  }, []);

  // Mark that the pointer moved — used to skip raycast on idle frames
  useEffect(() => {
    const onPointerMove = () => {
      pointerMovedRef.current = true;
    };
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useFrame((state: RootState, delta: number) => {
    if (!interactionsEnabled || !isInitialized) return;
    if (document.hidden) return;

    // --- Hover detection: throttled + skipped while a selection is active ---
    // Selection means camera is animating / locked on an object — there is
    // nothing to hover then, so we save a full scene raycast every frame.
    const now = performance.now();
    const canRaycast =
      !isAnySelected() &&
      pointerMovedRef.current &&
      now - lastRaycastRef.current >= RAYCAST_INTERVAL_MS;

    if (canRaycast) {
      pointerMovedRef.current = false;
      lastRaycastRef.current = now;

      const interactables = getAllInteractables();
      const meshes = Object.values(interactables);

      if (meshes.length > 0) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(meshes, true);

        let newHovered: string | undefined = undefined;
        if (intersects.length > 0) {
          const hitObject = intersects[0].object;

          let searchObject: THREE.Object3D | null = hitObject;
          while (searchObject && !newHovered) {
            newHovered = Object.keys(interactables).find(
              (key) => interactables[key] === searchObject,
            );
            searchObject = searchObject.parent;
          }
        }

        if (newHovered !== currentHovered) {
          setHovered(newHovered as SceneObjectKey);
        }
      }
    }

    // --- Cursor: only touch the DOM when the value actually changes ---
    const nextCursor =
      isAnyHovered() && !isAnySelected() ? "pointer" : "default";
    if (nextCursor !== cursorRef.current) {
      cursorRef.current = nextCursor;
      document.body.style.cursor = nextCursor;
    }

    const k = 6;
    const clampedDelta = Math.min(delta, 1 / 30);
    const activeMedia = currentHoveredMedia || currentMedia;
    const targetColor =
      activeMedia?.dominantColor || CONSTANTS.SPOTLIGHT_DEFAULT_COLOR;
    tempColor.set(targetColor);

    (Object.keys(getAllSpotlights()) as SceneObjectKey[]).forEach((key) => {
      const spotlight = getSpotlight(key);

      if (spotlight) {
        const targetIntensity =
          isHovered(key) || currentHoveredMedia !== undefined
            ? CONSTANTS.SPOTLIGHT_MAX_INTENSITY
            : 0;

        spotlight.intensity = THREE.MathUtils.lerp(
          spotlight.intensity,
          targetIntensity,
          clampedDelta * k,
        );

        spotlight.color.lerp(tempColor, clampedDelta * k);
      }
    });
  });

  return null;
};

export default SpotlightSystem;
