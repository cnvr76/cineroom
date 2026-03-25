import type { ReactNode } from "react";

export type ModalPlacement = {
  width: string;
  height: string;
  background?: string;
  inset: InsetType;
  rotation?: number;
  gap?: number;
  perspective?: number;
};

const Insets = {
  center: "0px",
  left: "0px auto 0px 0px",
  right: "0px 0px 0px auto",
} as const;

export type InsetType = keyof typeof Insets;

export const getInset = (key: InsetType, m: number = 0): string => {
  let inset = Insets[key];
  return inset.replaceAll("0", m.toString());
};

export type HtmlConfig = {
  children: ReactNode;
  placement: ModalPlacement;
};
