import { useContext } from "react";
import { VideoCallContext } from "../context/VideoCallContext";

export const useVideoCall = () => useContext(VideoCallContext);
