import { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

interface VideoCallModalProps {
  open: boolean;
  roomId: string;
  userId: string;
  userName: string;
  role: "learner" | "instructor";
  media:"audio"|"video";
  mode:"direct"|"live-session"
  onExit:()=>void;
  onClose: () => void;
}

const APP_ID = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
const SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET;

export const ZegoCallModal = ({
  open,
  roomId,
  userId,
  userName,
  role,
  media,
  mode,
  onExit,
  onClose,
}: VideoCallModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const zpRef = useRef<any>(null);

  const isLiveSession = mode === "live-session";
  const isInstructor = role ==="instructor"


  useEffect(() => {
    if (!open || !containerRef.current) return;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      APP_ID,
      SERVER_SECRET,
      roomId,
      userId,
      userName,
    );

    zpRef.current = ZegoUIKitPrebuilt.create(kitToken);

    zpRef.current.joinRoom({
      container: containerRef.current,
      scenario: { mode: isLiveSession
        ? ZegoUIKitPrebuilt.VideoConference
        : ZegoUIKitPrebuilt.OneONoneCall},
      showPreJoinView: false,
      maxUsers: isLiveSession ? 100 : 2,
      turnOnCameraWhenJoining: media==="video",
      turnOnMicrophoneWhenJoining: media==="audio",
      showScreenSharingButton:isLiveSession && isInstructor,
      showMyCameraToggleButton: media==="video",
      showLeaveRoomConfirmDialog: isLiveSession,
      showLeaveRoomButton: isLiveSession,
      showLayoutButton: isLiveSession,
      showTextChat: isLiveSession,
      showUserList: isLiveSession,


      onLeaveRoom: () => {
        onExit();
      },
    });

    return () => {
      zpRef.current?.destroy();
      zpRef.current = null;
    };
  }, [mode,media,isInstructor,isLiveSession,open, roomId, userId, userName, role, onClose,onExit]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="relative w-full h-full md:w-[90%] md:h-[90%] bg-black rounded-xl overflow-hidden">
        {isLiveSession && isInstructor &&<button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white text-black px-3 py-1 rounded"
        >
          End Session
        </button>}

        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
};
