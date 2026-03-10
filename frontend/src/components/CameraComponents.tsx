import { useRef, useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsType } from "three-stdlib";
import type { Vector3Tuple } from "three";

// Компонент для настройки позиций (с OrbitControls и логами)
function CameraSetup() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsType>(null);

  const logPosition = () => {
    if (controlsRef.current) {
      const pos: number[] = Object.values(camera.position).map((num) =>
        num.toFixed(2),
      );
      const target: number[] = Object.values(controlsRef.current.target).map(
        (num) => num.toFixed(2),
      );
      const quaternion: string[] = camera.quaternion
        .toArray()
        .map((num) => num.toFixed(2));
      console.log(`position: [${pos.join(", ")}]`);
      console.log(`target: [${target.join(", ")}]`);
      console.log(`quaternion: [${quaternion.join(", ")}]`);
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

  return null;
}

export { CameraFixed, CameraSetup };
