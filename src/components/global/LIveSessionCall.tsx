import { ZegoCallModal } from "../shared/ZegoCall";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useLiveSession } from "../../hooks/useLiveSession";

const LiveSessionCall = () => {
  const {activeSession ,leaveSession,endSession} = useLiveSession();
  const { id, name, role } = useSelector((s: RootState) => s.auth);

  if (!activeSession) return null;

  return (
    <ZegoCallModal
      open={true}
      roomId={activeSession.roomId}
      userId={id!}
      userName={name!}
      media="video"
      mode="live-session"
      role={role as "learner" | "instructor"}
      onExit={leaveSession}
      onClose={endSession}
    />
  );
};

export default LiveSessionCall;