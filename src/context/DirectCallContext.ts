import { createContext } from "react";

type IncomingCall = {
  conversationId: string;
  callerId: string;
  callerRole: "learner" | "instructor";
  type:"audio"|"video"
};

type ActiveCall = {
  roomId: string;
  participantId:string;
  type: "audio"|"video";
};

export const DirectCallContext = createContext<{
  activeCall: ActiveCall | null;
  incomingCall: IncomingCall | null;
  startCall: (roomId: string,participantId:string,type:"video"|"audio") => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}>({} as any);

