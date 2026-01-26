import { createContext } from "react";

export type LiveSession = {
  sessionId: string;
  roomId: string;
};

export const LiveSessionContext = createContext<{
  activeSession: LiveSession | null;
  startSession: (session: LiveSession) => void;
  leaveSession: () => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}>({} as any);
