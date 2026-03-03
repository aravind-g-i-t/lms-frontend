import { useState, useCallback, useMemo, type ReactNode } from "react";
import { FeedbackContext, type ModalState } from "../context/FeedbackContext";
import FeedbackModal from "../components/global/FeedbackModal";

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalState | null>(null);

  const show = useCallback((data: ModalState) => {
    setModal(data);
  }, []);

  const success = useCallback(
    (title: string, message?: string, duration = 0) =>
      show({ type: "success", title, message, duration }),
    [show]
  );

  const error = useCallback(
    (title: string, message?: string, duration = 0) =>
      show({ type: "error", title, message, duration }),
    [show]
  );

  const info = useCallback(
    (title: string, message?: string, duration = 0) =>
      show({ type: "info", title, message, duration }),
    [show]
  );

  const close = useCallback(() => setModal(null), []);

  // 🔥 memoize context value
  const value = useMemo(
    () => ({ show, success, error, info }),
    [show, success, error, info]
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <FeedbackModal modal={modal} onClose={close} />
    </FeedbackContext.Provider>
  );
};