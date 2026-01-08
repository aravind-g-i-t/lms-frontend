// src/providers/SocketProvider.tsx
import { createContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { incrementUnread, setUnreadCount } from "../redux/slices/chatSlice";

const SocketContext = createContext<Socket | null>(null);
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { id, role, accessToken } = useSelector((s: RootState) => s.auth);
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch= useDispatch<AppDispatch>()

  useEffect(() => {
    if (!id || !role || !accessToken || role === "admin" || role === "business") {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const s = io(SOCKET_URL, {
      // auth: {
      //   token: accessToken,
      //   userId: id,
      //   role
      // },
      autoConnect: true,
      transports: ["websocket"],
      withCredentials: true
    });

    socketRef.current = s;
    setSocket(s)

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
      socketRef.current?.emit("register", { userId: id, userType: role })
    });

    socketRef.current.on("unread_count", (count: number) => {
      console.log("Recieved unread count",count);
      
      dispatch(setUnreadCount(count));
    });

    socketRef.current.on("new_message", () => {
      dispatch(incrementUnread());
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null)
    };
  }, [id, role, accessToken,dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext