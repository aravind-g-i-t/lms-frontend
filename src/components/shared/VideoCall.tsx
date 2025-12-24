import { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

interface VideoCallModalProps {
  open: boolean;
  roomId: string;
  userId: string;
  userName: string;
  role: "learner" | "instructor";
  onClose: () => void;
}

const APP_ID = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
const SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET;

export const VideoCallModal = ({
  open,
  roomId,
  userId,
  userName,
  role,
  onClose,
}: VideoCallModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zpRef = useRef<any>(null);

  useEffect(() => {
    if (!open || !containerRef.current) return;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      APP_ID,
      SERVER_SECRET,
      roomId,
      userId,
      userName
    );

    zpRef.current = ZegoUIKitPrebuilt.create(kitToken);

    zpRef.current.joinRoom({
      container: containerRef.current,
      scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
      maxUsers: 2,
      turnOnCameraWhenJoining: role === "instructor",
      turnOnMicrophoneWhenJoining: role === "instructor",
      showScreenSharingButton: role === "instructor",
      onLeaveRoom: () => {
        onClose();
      },
    });

    return () => {
      zpRef.current?.destroy();
      zpRef.current = null;
    };
  }, [open, roomId, userId, userName, role, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="relative w-full h-full md:w-[90%] md:h-[90%] bg-black rounded-xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white text-black px-3 py-1 rounded"
        >
          End Call
        </button>

        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
};
