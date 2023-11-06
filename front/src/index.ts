import * as PIXI from "pixi.js";
// @ts-ignore

import { io } from "socket.io-client";
import { getPixiApp, createVirtualCursorSprite } from "./pixi";
import { CursorData, Position, SocketCursor } from "./types";
import { App } from "./models/App";
import { MainCursor } from "./models/MainCursor";
import { VirtualCursor } from "./models/VirtualCursor";
import { ClickAnimation } from "./models/ClickAnimation";
import {
  getAbsolutePositionFromRelativePosition,
  getRelativePositionFromAbsolutePosition,
} from "./utils/pixel";
// socketRef.current = io("http://localhost:3001");
// socketRef.current.on(
//   SocketEvents.PositionsUpdate,
//   (data: Array<SocketCursor>) => {
//     setCursors(data);
//   }
// );
// return () => {
//   if (socketRef.current) {
//     socketRef.current.disconnect();
//   }
// };

export enum SocketEvents {
  Connection = "connection",
  Disconnect = "disconnect",
  NewPosition = "new_position",
  PositionsUpdate = "positions_update",
  SendCursorClick = "send_cursor_click",
  CursorClick = "cursor_click",
}

async function main() {
  const socket = io("http://localhost:3001");

  function onMouseMove(e: MouseEvent) {
    const position = App.absoluteToRelativePosition({
      x: e.clientX,
      y: e.clientY,
    });
    socket.emit(SocketEvents.NewPosition, position);
  }

  function onMouseClick(e: MouseEvent) {
    const position = App.absoluteToRelativePosition({
      x: e.clientX,
      y: e.clientY,
    });
    socket.emit(SocketEvents.SendCursorClick, {
      ...position,
      id: socket.id,
    });
  }

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("click", onMouseClick);

  socket.on("connect", () => {
    console.log("connected");
    console.log(socket.id);
    const app = new App(socket.id);

    socket.on(SocketEvents.PositionsUpdate, (data: Array<SocketCursor>) => {
      app.clearCursors();
      data.forEach((cursor) => {
        const position = App.relativeToAbsolutePosition({
          x: cursor.x,
          y: cursor.y,
        });
        if (cursor.id === socket.id) {
          app.addMainCursor(position);
        } else {
          app.addVirtualCursor({ ...position, color: cursor.color });
        }
      });
    });

    socket.on(SocketEvents.CursorClick, (data: CursorData) => {
      app.addCursorClickAnimation(data);
    });
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
}

main();
