import type { HtmlConfig } from "./types/components.types";

const ModalWindow = ({ children, placement }: HtmlConfig) => {
  return (
    <div
      style={{
        width: `${placement.width}px`,
        height: `${placement.height}px`,
        background: "red",
      }}
    >
      {children}
    </div>
  );
};

export default ModalWindow;
