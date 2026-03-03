import { createContext } from "react";

export type LiveSession = {
  sessionId: string;
  roomId: string;
};

type LiveSessionContextType = {
  activeSession: LiveSession | null;
  startSession: (session: LiveSession) => void;
  leaveSession: () => void;
};

export const LiveSessionContext =
  createContext<LiveSessionContextType | undefined>(undefined);