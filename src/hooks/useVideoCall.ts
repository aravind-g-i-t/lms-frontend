import { useEffect, useState } from "react";

export const useVideoCall = (socket: any) => {
  const [call, setCall] = useState<{
    open: boolean;
    roomId: string;
    callType: "audio" | "video";
    incoming: boolean;
  }>({
    open: false,
    roomId: "",
    callType: "video",
    incoming: false,
  });

  useEffect(() => {
    if (!socket) return;

    socket.on("call:incoming", ({ roomId, callType }) => {
      setCall({
        open: false,
        roomId,
        callType,
        incoming: true,
      });
    });

    socket.on("call:accepted", () => {
      setCall(c => ({ ...c, open: true, incoming: false }));
    });

    socket.on("call:rejected", () => {
      setCall({ open: false, roomId: "", callType: "video", incoming: false });
    });

    socket.on("call:ended", () => {
      setCall({ open: false, roomId: "", callType: "video", incoming: false });
    });

    return () => {
      socket.off("call:incoming");
      socket.off("call:accepted");
      socket.off("call:rejected");
      socket.off("call:ended");
    };
  }, [socket]);

  return { call, setCall };
};
