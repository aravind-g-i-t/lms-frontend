import { useState, type ReactNode } from "react";
import { FeedbackContext, type ModalState } from "../context/FeedbackContext";
import FeedbackModal from "../components/global/FeedbackModal";

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalState | null>(null);

  const show = (data: ModalState) => setModal(data);

  const success = (title: string, message?: string, duration = 0) =>
    show({ type: "success", title, message, duration });

  const error = (title: string, message?: string, duration = 0) =>
    show({ type: "error", title, message, duration });

  const info = (title: string, message?: string, duration = 0) =>
    show({ type: "info", title, message, duration });

  const close = () => setModal(null);

  return (
    <FeedbackContext.Provider value={{ show, success, error, info }}>
      {children}
      <FeedbackModal modal={modal} onClose={close} />
    </FeedbackContext.Provider>
  );
};
