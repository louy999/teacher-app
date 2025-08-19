import { io } from "socket.io-client";

const socket = io(process.env.img, {
  transports: ["websocket"],
});

export default socket;
