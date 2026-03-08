import { useContext, createContext } from "react";
import type { SceneState, SceneActions } from "./types/scene.types";

export const StateContext = createContext<SceneState>(null!);
export const ActionsContext = createContext<SceneActions>(null!);

export const useSceneState = () => {
  const context = useContext(StateContext);
  if (!context)
    throw new Error("useSceneState must be used within SceneProvider");
  return context;
};

export const useSceneActions = () => {
  const context = useContext(ActionsContext);
  if (!context)
    throw new Error("useSceneActions must be used within SceneProvider");
  return context;
};
