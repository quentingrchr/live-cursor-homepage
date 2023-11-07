import * as PIXI from "pixi.js";
import { Socket } from "socket.io-client";
import { SocketEvents } from "../../../shared/src";
import { AbstractZoneSelection } from "./AbstractZoneSelection";

export class ZoneSelection extends AbstractZoneSelection {
  isSelecting: boolean;
  socket: Socket;

  constructor(stage: PIXI.Container, socket: Socket) {
    super(stage);
    this.isSelecting = false;
    this.socket = socket;
  }

  startSelection(x: number, y: number) {
    this.isSelecting = true;
    this.setStartPoint({ x, y });
    const { startX, startY } = this.getStartPoint();
    this.socket.emit(SocketEvents.SendStartSelection, {
      id: this.socket.id,
      x: startX,
      y: startY,
    });
  }

  /* Will be called on mousemove event, only if isSelecting is true and will only update the endX and endY values */
  updateSelection(x: number, y: number) {
    const { startX, startY, endX, endY } = this.getPosition();
    if (startX === undefined || startY === undefined) return;

    if (this.isSelecting) {
      this.setEndPoint({ x, y });

      this.draw();
      const position = this.getPosition();
      this.socket.emit(SocketEvents.SendUpdateSelection, {
        id: this.socket.id,
        startX: position.startX,
        startY: position.startY,
        endX: position.endX,
        endY: position.endY,
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
