import type { ReactNode } from "react";

export type ModalPlacement = {
  width: string;
  height: string;
  background?: string;
  inset: InsetType;
};

const Insets = {
  center: "auto 0 auto 0",
  left: "auto 0 0 0",
  right: "0 0 auto 0",
} as const;

export type InsetType = keyof typeof Insets;

export type HtmlConfig = {
  children: ReactNode;
  placement: ModalPlacement;
};
