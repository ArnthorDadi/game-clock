import connectToSocketIOServer, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

export type ISocket = Socket<DefaultEventsMap, DefaultEventsMap>;
export interface ISocketConnection {
  socket: ISocket;
}

const socket: ISocket = connectToSocketIOServer("http://localhost:8080");
export default { socket: socket } as ISocketConnection;
