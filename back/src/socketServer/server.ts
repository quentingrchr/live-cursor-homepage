import http from "http";
import { Socket } from "socket.io";
import * as socketio from "socket.io";
import {
  CursorData,
  CursorState,
  Position,
  SendStartSelectionPayload,
  SendUpdateSelectionPayload,
} from "../types";
import { SocketEvents } from "../../../shared";
import handleDisconnect from "./handlers/disconnect";
import { getCursorColor, registerCursor } from "./utils";

const configureSocketServer = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  const io = new socketio.Server(server, {
    cors: {
      origin: "*",
    },
  });

  const cursorsState: CursorState = {};

  io.on(SocketEvents.Connection, (socket: Socket) => {
    registerCursor(socket.id, cursorsState);

    socket.on(SocketEvents.NewPosition, (data: Position) => {
      cursorsState[socket.id] = { ...cursorsState[socket.id], ...data };

      const cursorStateArray = Object.values(cursorsState);
      io.emit(SocketEvents.PositionsUpdate, cursorStateArray as CursorData[]);
    });

    socket.on(
      SocketEvents.SendCursorClick,
      (data: Omit<CursorData, "color">) => {
        console.log(`User ${socket.id} clicked`);
        io.emit(SocketEvents.CursorClick, {
          ...data,
          color: getCursorColor(socket.id, cursorsState),
        });
      }
    );

    socket.on(
      SocketEvents.SendStartSelection,
      (data: SendStartSelectionPayload) => {
        console.log(
          `User ${socket.id} started selection at x: ${data.startX}, y: ${data.startY}`
        );
        io.emit(SocketEvents.StartSelection, {
          ...data,
          id: socket.id,
          color: getCursorColor(socket.id, cursorsState),
        });
      }
    );

    socket.on(
      SocketEvents.SendUpdateSelection,
      (data: SendUpdateSelectionPayload) => {
        console.log(
          `User ${socket.id} updated selection: x: ${data.endX}, y: ${data.endY}`
        );
        io.emit(SocketEvents.UpdateSelection, {
          ...data,
          id: socket.id,
        });
      }
    );

    socket.on(SocketEvents.SendEndSelection, () => {
      console.log(`User ${socket.id} ended selection`);
      io.emit(SocketEvents.EndSelection, {
        id: socket.id,
      });
    });

    handleDisconnect(socket, cursorsState);
  });
};

export default configureSocketServer;
