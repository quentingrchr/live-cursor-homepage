import { Socket } from "socket.io";
import { SocketEvents } from "../../../../shared";
import { CursorData } from "../../types";

const handleDisconnect = (
  socket: Socket,
  cursorsData: Record<string, CursorData>
) => {
  socket.on(SocketEvents.Disconnect, () => {
    delete cursorsData[socket.id];
    console.log(`A user disconnected with socket id ${socket.id}`);
  });
};

export default handleDisconnect;
