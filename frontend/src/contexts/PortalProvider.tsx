import { type ReactNode } from "react";
import { StateContext, ActionsContext } from "./SceneContext";

type PortalProviderProps = {
  children: ReactNode;
} & Record<string, any>;

const PortalProvider = ({
  children,
  stateContextValue,
  actionsContextValue,
}: PortalProviderProps) => {
  return (
    <StateContext.Provider value={stateContextValue}>
      <ActionsContext.Provider value={actionsContextValue}>
        {children}
      </ActionsContext.Provider>
    </StateContext.Provider>
  );
};
export default PortalProvider;
