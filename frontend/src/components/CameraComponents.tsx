import { useRef, useLayoutEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsType } from "three-stdlib";
import type { Vector3Tuple } from "three";

// Компонент для настройки позиций (с OrbitControls и логами)
function CameraSetup() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsType>(null);

  const logPosition = () => {
    if (controlsRef.current) {
      const pos = camera.position;
      const target = controlsRef.current.target;
      const quaternion = camera.quaternion;

      console.log(
        `position: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(
          2,
        )}]`,
      );
      console.log(
        `target: [${target.x.toFixed(2)}, ${target.y.toFixed(
          2,
        )}, ${target.z.toFixed(2)}]`,
      );
      console.log(
        `quaternion: [${quaternion.x.toFixed(2)}, ${quaternion.y.toFixed(
          2,
        )}, ${quaternion.z.toFixed(2)}, ${quaternion.w.toFixed(2)}]`,
      );
      console.log("---");
    }
  };

  return <OrbitControls ref={controlsRef} onChange={logPosition} />;
}

type CameraFixedProps = {
  position: Vector3Tuple;
  target: Vector3Tuple;
};
// Компонент для фиксированной позиции камеры (без OrbitControls)
function CameraFixed({ position, target }: CameraFixedProps) {
  const { camera } = useThree();

  // Синхронно до первого рендера через useLayoutEffect
  useLayoutEffect(() => {
    camera.position.set(...position);
    camera.lookAt(...target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
  }, []);

  useFrame(() => {
    camera.updateMatrixWorld(true);
  });

  return null;
}

export { CameraFixed, CameraSetup };
