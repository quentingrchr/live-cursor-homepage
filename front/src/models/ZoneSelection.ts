import * as PIXI from "pixi.js";
import { Socket } from "socket.io-client";
import { SocketEvents } from "../../../shared/src";
import { AbstractZoneSelection } from "./AbstractZoneSelection";
import { App } from "./App";

export class ZoneSelection extends AbstractZoneSelection {
  isSelecting: boolean;
  socket: Socket;

  constructor(stage: PIXI.Container, socket: Socket) {
    super(stage, "white");
    this.isSelecting = false;
    this.socket = socket;
  }

  startSelection(x: number, y: number) {
    this.isSelecting = true;
    this.setStartPoint({ x, y });
    const relativePosition = App.absoluteToRelativePosition({ x, y });
    this.socket.emit(SocketEvents.SendStartSelection, {
      id: this.socket.id,
      startX: relativePosition.x,
      startY: relativePosition.y,
    });
  }

  /* Will be called on mousemove event, only if isSelecting is true and will only update the endX and endY values */
  updateSelection(x: number, y: number) {
    const { startX, startY } = this.getPosition();
    if (startX === undefined || startY === undefined) return;

    if (this.isSelecting) {
      this.setEndPoint({ x, y });

      this.draw();
      const relativePosition = App.absoluteToRelativePosition({
        x,
        y,
      });

      this.socket.emit(SocketEvents.SendUpdateSelection, {
        id: this.socket.id,
        endX: relativePosition.x,
        endY: relativePosition.y,
      });
    }
  }

  endSelection() {
    this.isSelecting = false;
    this.socket.emit(SocketEvents.SendEndSelection);
  }

  clearSelection() {
    this.clear();
    this.isSelecting = false;
    this.removePosition();
  }

  getIsSelecting() {
    return this.isSelecting;
  }
}
