import { VideoCallModal } from "../shared/VideoCall";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useVideoCall } from "../../hooks/useVideoCall";

const GlobalVideoCallModal = () => {
  const { activeCall, endCall } = useVideoCall();
  const { id, name, role } = useSelector((s: RootState) => s.auth);

  if (!activeCall) return null;

  return (
    <VideoCallModal
      open={true}
      roomId={activeCall.roomId}
      userId={id!}
      userName={name!}
      type={activeCall.type}
      role={role as "learner" | "instructor"}
      onClose={endCall}
    />
  );
};

export default GlobalVideoCallModal;
