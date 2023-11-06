import * as PIXI from "pixi.js";
// @ts-ignore

import { io } from "socket.io-client";
import { getPixiApp, createVirtualCursorSprite } from "./pixi";
import { CursorData, Position, SocketCursor } from "./types";
import { App } from "./models/App";
import { MainCursor } from "./models/MainCursor";
import { VirtualCursor } from "./models/VirtualCursor";
import { ClickAnimation } from "./models/ClickAnimation";
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
  CursorClick = "cursor_click",
}

async function main() {
  const socket = io("http://localhost:3001");
  function onMouseMove(e: MouseEvent) {
    socket.emit(SocketEvents.NewPosition, { x: e.clientX, y: e.clientY });
  }

  function onMouseClick(e: MouseEvent) {
    socket.emit(SocketEvents.CursorClick, {
      x: e.clientX,
      y: e.clientY,
      id: socket.id,
    });
  }

  socket.on("connect", () => {
    console.log("connected");
    console.log(socket.id);
    const app = new App(socket.id);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onMouseClick);

    socket.on(SocketEvents.PositionsUpdate, (data: Array<SocketCursor>) => {
      app.clearCursors();
      data.forEach((cursor) => {
        if (cursor.id === socket.id) {
          const mainCursor = new MainCursor(cursor.x, cursor.y);
          app.addCursor(mainCursor);
        } else {
          const virtualCursor = new VirtualCursor(
            cursor.x,
            cursor.y,
            cursor.color
          );
          app.addCursor(virtualCursor);
        }
      });
    });

    socket.on(SocketEvents.CursorClick, (data: CursorData) => {
      const click = new ClickAnimation(data.x, data.y, data.color, app.stage);
      app.addClickAnimation(click);
    });
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
}

main();
