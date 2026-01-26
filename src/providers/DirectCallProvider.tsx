import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { DirectCallContext } from "../context/DirectCallContext";

type CallType = "audio" | "video";

type ActiveCall = {
  roomId: string;
  participantId:string;
  type: CallType;
};


type IncomingCall = {
  conversationId: string;
  callerId: string;
  callerRole: "learner" | "instructor";
  type:CallType
};

export const DirectCallProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useSocket();
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  

  useEffect(() => {
    if (!socket) return;

    socket.on("incomingCall", setIncomingCall);

    socket.on("callAccepted", ({ conversationId ,participantId,type}) => {
      setActiveCall({ roomId: conversationId ,participantId,type});
      setIncomingCall(null);
    });

    socket.on("callEnded", () => {
      setActiveCall(null);
    });

    socket.on("disconnect", () => {
      setActiveCall(null);
      setIncomingCall(null);
    });

    return () => {
      socket.off("incomingCall");
      socket.off("callAccepted");
      socket.off("callEnded");
    };
  }, [socket]);

  const startCall = (roomId: string,participantId:string,type:CallType) => {
    setActiveCall({ roomId,participantId,type });
  };

  const acceptCall = () => {
    if (!incomingCall || !socket) return;
    socket.emit("acceptCall", {
      conversationId: incomingCall.conversationId,
      callerId: incomingCall.callerId,
      type:incomingCall.type
    });
  };

  const rejectCall = () => {
    if (!incomingCall || !socket) return;
    socket.emit("rejectCall", {
      callerId: incomingCall.callerId,
    });
    setIncomingCall(null);
  };

  const endCall = () => {
    socket?.emit("endCall",{participantId:activeCall?.participantId});
    setActiveCall(null);
  };

  return (
    <DirectCallContext.Provider
      value={{ activeCall, incomingCall, startCall, acceptCall, rejectCall, endCall }}
    >
      {children}
    </DirectCallContext.Provider>
  );
};
