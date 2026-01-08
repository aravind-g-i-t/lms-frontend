// import { useEffect, useRef } from 'react';
// import { io, Socket } from 'socket.io-client';

// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// export function useSocket(userId: string | null, userType: 'learner' | 'instructor') {
//     const socketRef = useRef<Socket | null>(null);

//     useEffect(() => {
//         if (!userId) return;

//         // Initialize socket connection
//         socketRef.current = io(SOCKET_URL, {
//             autoConnect: true,
//         });

//         const socket = socketRef.current;

//         // Register user when connected
//         socket.on('connect', () => {
//             console.log('Connected to socket server');
//             socket.emit('register', { userId, userType });
//         });

//         // Handle reconnection
//         socket.on('reconnect', () => {
//             console.log('Reconnected to socket server');
//             socket.emit('register', { userId, userType });
//         });

//         socket.on('error', (error) => {
//             console.error('Socket error:', error);
//         });

//         return () => {
//             socket.disconnect();
//         };
//     }, [userId, userType]);

//     return socketRef.current;
// }