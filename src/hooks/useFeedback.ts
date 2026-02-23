import { useContext } from "react";
import { FeedbackContext } from "../context/FeedbackContext";
export const useFeedback = () => {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error("useFeedback must be used inside FeedbackProvider");
  }

  return context;
};
