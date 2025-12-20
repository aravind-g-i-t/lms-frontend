
// import { socket } from "../config/socket";
// import type { IMessage } from "../types/entities";

// export function sendMessage(payload: IMessage) {
//   socket.emit("send_message", payload);
// }

// export function markMessagesRead(conversationId: string, readerId: string, readerRole: string) {
//   socket.emit("mark_read", {
//     conversationId,
//     readerId,
//     readerRole
//   });
// }

// export function onNewMessage(callback: (msg: any) => void) {
//   socket.on("new_message", callback);
// }

// export function onMessageSent(callback: (msg: any) => void) {
//   socket.on("message_sent", callback);
// }

// export function onMessagesRead(callback: (data: any) => void) {
//   socket.on("messages_read", callback);
// }
