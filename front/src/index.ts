import * as PIXI from "pixi.js";
// @ts-ignore
import svg from "./assets/images/main-cursor.svg";

import { io } from "socket.io-client";
import { getPixiApp, createVirtualCursorSprite } from "./pixi";
import { Position, SocketCursor } from "./types";
import { App } from "./App";
import { MainCursor } from "./MainCursor";
import { VirtualCursor } from "./VirtualCursor";
import { ClickCursor } from "./ClickCursor";
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
    socket.emit(SocketEvents.CursorClick, { x: e.clientX, y: e.clientY });
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

    socket.on(SocketEvents.CursorClick, (data: Position) => {
      const click = new ClickCursor(data.x, data.y);
      app.addClickAnimation(click);
    });
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
}

main();
