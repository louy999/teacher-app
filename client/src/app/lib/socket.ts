import { io, Socket } from "socket.io-client";

let socket: Socket;

if (!socket) {
  socket = io(process.env.img!, {
    transports: ["websocket"],
  });
}

export default socket;
