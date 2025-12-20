import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  withCredentials: true,

});

export function joinSocket(userId: string) {
  socket.emit("join", userId);
}
