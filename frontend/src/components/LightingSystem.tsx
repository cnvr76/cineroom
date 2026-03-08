import { useRef } from "react";

const AMBIENT_MAX_INTENSITY = 1.6;
const DIRECTIONAL_MAX_INTENSITY = 1;

const LightingSystem = () => {
  const ambientLightRef = useRef(null);
  const directionalLightRef = useRef(null);

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={AMBIENT_MAX_INTENSITY} />
      <directionalLight
        ref={directionalLightRef}
        position={[10, 10, 5]}
        intensity={DIRECTIONAL_MAX_INTENSITY}
      />
    </>
  );
};

export default LightingSystem;
