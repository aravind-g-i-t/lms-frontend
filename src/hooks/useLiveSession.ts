import { useContext } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import type { AppDispatch } from "../redux/store";
import { LiveSessionContext } from "../context/LiveSessionContext";
import { endLiveSession } from "../services/instructorServices";
import { useSocket } from "./useSocket";
// import { endLiveSession } from "../services/learnerServices";

export const useLiveSession = () => {
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSocket()

  const context = useContext(LiveSessionContext);
  if (!context) {
    throw new Error("useLiveSession must be used within LiveSessionProvider");
  }

  const { activeSession, startSession, leaveSession } = context;

  /**
   * Instructor ends the live session for everyone
   */
  const endSession = async () => {
    if (!activeSession) return;

    try {
      await dispatch(
        endLiveSession({
          sessionId: activeSession.sessionId,
        })
      ).unwrap();

      socket?.emit("endLiveSession", {
        sessionId:activeSession.sessionId,
      });

      leaveSession();
    } catch (err) {
      toast.error(err as string)
    }
  };

  /**
   * Learner just leaves (no backend call)
   */

  return {
    activeSession,
    startSession,

    endSession,
    leaveSession,

  };
};
