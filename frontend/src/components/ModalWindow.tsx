import { type HtmlConfig, getInset } from "./types/components.types";

const ModalWindow = ({ children, placement }: HtmlConfig) => {
  return (
    <section className="m-3">
      <div
        style={{
          width: `calc(${placement.width} - (${placement.gap ?? 0}px * 2))`,
          height: `calc(${placement.height} - (${placement.gap ?? 0}px * 2))`,
          background: placement.background ?? "red",
          position: "absolute",
          inset: getInset(placement.inset, placement.gap ?? 0),
          margin: placement.inset === "center" ? "auto" : "auto 0",
          zIndex: 2000,
          // transform: `perspective(1200px) rotateY(-16deg)`,
          borderRadius: 12,
          padding: placement.gap ?? 0,
          transform: `perspective(${placement.perspective ?? Infinity}px) rotateY(${placement.rotation ?? 0}deg)`,
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default ModalWindow;
