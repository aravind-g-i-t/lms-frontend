import { useEffect, useState } from "react";
import { LiveSessionContext,type LiveSession } from "../context/LiveSessionContext";
import { useSocket } from "../hooks/useSocket";

export const LiveSessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const socket = useSocket();
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);

  useEffect(() => {
      if (!socket) return;
  
      socket.on("liveSessionEnded", () => {
        setActiveSession(null);
      });

      return () => {
        socket.off("liveSessionEnded");

      };
    }, [socket]);

  const startSession = (session: LiveSession) => {
    setActiveSession(session);
  };

  const leaveSession = () => {
    setActiveSession(null);
  };

  return (
    <LiveSessionContext.Provider
      value={{ activeSession, startSession, leaveSession }}
    >
      {children}
    </LiveSessionContext.Provider>
  );
};
