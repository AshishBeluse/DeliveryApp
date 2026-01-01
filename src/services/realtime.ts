// /**
//  * Socket-ready structure (placeholder)
//  *
//  * Later you can switch from polling to socket events:
//  * - order:new
//  * - order:updated
//  * - driver:assigned
//  *
//  * Keep this file as the single place to initialize realtime.
//  */
// export type RealtimeClient = {
//   connect: () => void;
//   disconnect: () => void;
//   isConnected: () => boolean;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   on: (event: string, handler: (...args: any[]) => void) => void;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   off: (event: string, handler?: (...args: any[]) => void) => void;
// };

// export function createRealtimeClient(): RealtimeClient {
//   // No dependency on socket.io-client yet (keeps build clean).
//   // When you add socket.io-client, initialize it here.
//   let connected = false;

//   return {
//     connect: () => {
//       connected = true;
//     },
//     disconnect: () => {
//       connected = false;
//     },
//     isConnected: () => connected,
//     on: () => {},
//     off: () => {},
//   };
// }

import { io, Socket } from 'socket.io-client';
import { Env } from '../config/env';

let socket: Socket | null = null;

export function connectSocket(token: string) {
  if (socket) return socket;

  socket = io(Env.API_BASE_URL, {
    transports: ['websocket'],
    auth: { token },
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
