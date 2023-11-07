import * as PIXI from "pixi.js";
// @ts-ignore
import { SocketEvents } from "../../shared";

import { io } from "socket.io-client";
import { CursorData, SocketCursor } from "../types";
import { App } from "./models/App";

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
    const app = new App(socket);

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
