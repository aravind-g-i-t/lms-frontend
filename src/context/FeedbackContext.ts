import { createContext } from "react";

export type ModalType = "success" | "error" | "info";

export interface ModalState {
  type: ModalType;
  title: string;
  message?: string;
  duration?: number;
}

export interface FeedbackContextValue {
  show: (data: ModalState) => void;
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
}

export const FeedbackContext = createContext<FeedbackContextValue | undefined>(
  undefined
);
