import { ZegoCallModal } from "../shared/ZegoCall";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useDirectCall } from "../../hooks/useDirectCall";

const DirectCall = () => {
  const { activeCall, endCall } = useDirectCall();
  const { id, name, role } = useSelector((s: RootState) => s.auth);

  if (!activeCall) return null;

  return (
    <ZegoCallModal
      open={true}
      roomId={activeCall.roomId}
      userId={id!}
      userName={name!}
      media={activeCall.type}
      mode="direct"
      role={role as "learner" | "instructor"}
      onExit={endCall}
      onClose={endCall}
    />
  );
};

export default DirectCall;
