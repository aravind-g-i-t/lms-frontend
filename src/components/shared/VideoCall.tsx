import { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { X } from "lucide-react";

interface VideoCallModalProps {
  isOpen: boolean;
  roomId: string;
  userId: string;
  userName: string;
  role: "learner" | "instructor";
  callType: "audio" | "video";
  onClose: () => void;
}

export const VideoCallModal = ({
  isOpen,
  roomId,
  userId,
  userName,
  role,
  callType,
  onClose,
}: VideoCallModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zegoRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const init = async () => {
      const res = await fetch(`/api/video/token?roomId=${roomId}`, {
        credentials: "include",
      });
      const { token } = await res.json();

      const kitToken =
        ZegoUIKitPrebuilt.generateKitTokenForProduction(
          Number(import.meta.env.VITE_ZEGO_APP_ID),
          token,
          roomId,
          userId,
          userName
        );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zegoRef.current = zp;

      zp.joinRoom({
        container: containerRef.current,
        scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
        maxUsers: 2,
        turnOnCameraWhenJoining:
          callType === "video" && role === "instructor",
        turnOnMicrophoneWhenJoining: role === "instructor",
        showTextChat: false,
        showUserList: false,
        onLeaveRoom: onClose,
      });
    };

    init();
    return () => zegoRef.current?.destroy();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-red-600 p-3 rounded-full text-white"
      >
        <X />
      </button>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
