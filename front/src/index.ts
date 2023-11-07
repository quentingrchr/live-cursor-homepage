import * as PIXI from "pixi.js";
// @ts-ignore
// import { SocketEvents } from "../../shared";

import { io } from "socket.io-client";
import { CursorData, SocketCursor } from "../types";
import { App } from "./models/App";

export enum SocketEvents {
  Connection = "connection",
  Disconnect = "disconnect",
  NewPosition = "new_position",
  PositionsUpdate = "positions_update",
  SendCursorClick = "send_cursor_click",
  CursorClick = "cursor_click",
  StartSelection = "start_selection",
  UpdateSelection = "update_selection",
  EndSelection = "end_selection",
  SendStartSelection = "send_start_selection",
  SendUpdateSelection = "send_update_selection",
  SendEndSelection = "send_end_selection",
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
    const app = new App(socket);

    socket.on(
      SocketEvents.StartSelection,
      (data: { id: string; startX: number; startY: number; color: string }) => {
        console.log("start selection");
        if (data.id === socket.id) return;
        app.addVirtualZoneSelection(
          data.id,
          {
            x: data.startX,
            y: data.startY,
          },
          data.color
        );
      }
    );

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

    socket.on(
      SocketEvents.UpdateSelection,
      (data: { id: string; endX: number; endY: number }) => {
        if (data.id === socket.id) return;
        app.updateVirtualZoneSelection(data.id, {
          x: data.endX,
          y: data.endY,
        });
      }
    );

    socket.on(SocketEvents.EndSelection, (data: { id: string }) => {
      if (data.id === socket.id) return;
      app.endVirtualZoneSelection(data.id);
    });
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
}

main();
