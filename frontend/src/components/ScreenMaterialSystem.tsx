import { useEffect, useMemo, useRef } from "react";
import { useSceneActions, useSceneState } from "../contexts/SceneContext";
import * as THREE from "three";
import { useTexture, useVideoTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CONSTANTS, IMG_BASE } from "../config/sceneObjects";

const PLAY_BUTTON_PATH = "/images/play-button.png";
const BLACK = "#000000";

const ScreenMaterialSystem = () => {
  const { getInteractable } = useSceneActions();
  const { currentMedia, currentHoveredMedia } = useSceneState();

  const playIconTexture = useTexture(PLAY_BUTTON_PATH);
  const defaultNoiseTexture = useVideoTexture("/images/gifs/noise3.mp4", {
    muted: true,
    loop: true,
    autoplay: true,
    playsInline: true,
  });

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        tCurrent: { value: null },
        tNext: { value: null },
        uAspectCurrent: { value: 1.0 },
        uAspectNext: { value: 1.0 },
        uBgCurrent: { value: new THREE.Color(BLACK) },
        uBgNext: { value: new THREE.Color(BLACK) },
        tPlayIcon: { value: null },
        uMix: { value: 0.0 },
        uShowPlay: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D tCurrent;
        uniform sampler2D tNext;
        uniform sampler2D tPlayIcon;
        
        uniform float uAspectCurrent;
        uniform float uAspectNext;
        uniform vec3 uBgCurrent;
        uniform vec3 uBgNext;
        
        uniform float uMix;
        uniform float uShowPlay;

        vec4 getColor(sampler2D tex, vec2 uv, float aspect, vec3 bgColor) {
          vec2 newUv = uv;
          newUv.x = 1.0 - newUv.x; 

          if (aspect > 1.0) {
            newUv.y = (newUv.y - 0.5) * aspect + 0.5;
          } else if (aspect < 1.0) {
            newUv.x = (newUv.x - 0.5) / aspect + 0.5;
          }

          if (newUv.x < 0.0 || newUv.x > 1.0 || newUv.y < 0.0 || newUv.y > 1.0) {
            return vec4(bgColor, 1.0);
          }
          return texture2D(tex, newUv);
        }

        void main() {
          vec4 currentColor = getColor(tCurrent, vUv, uAspectCurrent, uBgCurrent);
          vec4 nextColor = getColor(tNext, vUv, uAspectNext, uBgNext);
          vec4 baseColor = mix(currentColor, nextColor, uMix);

          vec2 centeredUv = vUv - 0.5;
          centeredUv.x *= 1.4;
          
          vec2 iconUv = centeredUv * 5.0 + 0.5;
          iconUv.x = 1.0 - iconUv.x;
          
          if (iconUv.x > 0.0 && iconUv.x < 1.0 && iconUv.y > 0.0 && iconUv.y < 1.0) {
            vec4 iconRaw = texture2D(tPlayIcon, iconUv);
            baseColor.rgb = mix(baseColor.rgb, vec3(0.0), iconRaw.a * uShowPlay);
          }

          gl_FragColor = baseColor;

          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
      toneMapped: false,
    });
  }, []);

  useEffect(() => {
    if (defaultNoiseTexture) {
      defaultNoiseTexture.colorSpace = THREE.SRGBColorSpace;
      material.uniforms.tCurrent.value = defaultNoiseTexture;
      material.uniforms.tNext.value = defaultNoiseTexture;
    }
  }, [defaultNoiseTexture, material]);

  useEffect(() => {
    if (playIconTexture) {
      playIconTexture.flipY = false;
      playIconTexture.colorSpace = THREE.SRGBColorSpace;
      material.uniforms.tPlayIcon.value = playIconTexture;
    }
  }, [playIconTexture, material]);

  const targetState = useMemo(() => {
    if (currentHoveredMedia) {
      return {
        type: "poster",
        path: currentHoveredMedia.posterPath,
        color: currentHoveredMedia.dominantColor || BLACK,
        showPlay: false,
      };
    }
    if (currentMedia) {
      return {
        type: "poster",
        path: currentMedia.posterPath,
        color: currentMedia.dominantColor || BLACK,
        showPlay: true,
      };
    }
    return { type: "noise", path: null, color: BLACK, showPlay: false };
  }, [currentHoveredMedia, currentMedia]);

  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const activePathRef = useRef<string | null>("noise");

  useEffect(() => {
    const targetId = targetState.type === "noise" ? "noise" : targetState.path;
    if (targetId === activePathRef.current) return;

    const timer = setTimeout(() => {
      const startCrossfade = (
        newTex: THREE.Texture,
        newAspect: number,
        newColor: string,
      ) => {
        if (material.uniforms.uMix.value > 0.5) {
          material.uniforms.tCurrent.value = material.uniforms.tNext.value;
          material.uniforms.uAspectCurrent.value =
            material.uniforms.uAspectNext.value;
          material.uniforms.uBgCurrent.value.copy(
            material.uniforms.uBgNext.value,
          );
        }

        material.uniforms.tNext.value = newTex;
        material.uniforms.uAspectNext.value = newAspect;
        material.uniforms.uBgNext.value.set(newColor);
        material.uniforms.uMix.value = 0.0;
        activePathRef.current = targetId;
      };

      if (targetState.type === "poster" && targetState.path) {
        textureLoader.load(`${IMG_BASE}${targetState.path}`, (tex) => {
          tex.flipY = true;
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = false;
          tex.minFilter = THREE.LinearFilter;

          const imgAspect = tex.image.width / tex.image.height;
          const screenAspect = 1.77;
          const aspect = imgAspect / screenAspect;

          startCrossfade(tex, aspect, targetState.color);
        });
      } else if (targetState.type === "noise" && defaultNoiseTexture) {
        startCrossfade(defaultNoiseTexture, 1.0, targetState.color);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [targetState, defaultNoiseTexture, material, textureLoader]);

  const isAppliedRef = useRef(false);

  useFrame((_, delta: number) => {
    const clampedDelta = Math.min(delta, 1 / 30);

    if (!isAppliedRef.current) {
      const tvObject = getInteractable("tv");
      if (tvObject) {
        tvObject.children.forEach((child: any) => {
          if (child.isMesh && child.material?.name.includes("Screen")) {
            child.material = material;
            isAppliedRef.current = true;
          }
        });
      }
    }

    if (isAppliedRef.current) {
      material.uniforms.uMix.value = THREE.MathUtils.lerp(
        material.uniforms.uMix.value,
        1.0,
        clampedDelta * CONSTANTS.MEDIA_HOVER_TIMEOUT,
      );
      material.uniforms.uShowPlay.value = THREE.MathUtils.lerp(
        material.uniforms.uShowPlay.value,
        targetState.showPlay ? 1.0 : 0.0,
        clampedDelta * CONSTANTS.MEDIA_HOVER_TIMEOUT,
      );
    }
  });

  return null;
};

export default ScreenMaterialSystem;
