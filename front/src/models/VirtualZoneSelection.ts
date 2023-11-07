import * as PIXI from "pixi.js";
import { Socket } from "socket.io-client";
import { SocketEvents } from "../../../shared/src";
import { AbstractZoneSelection } from "./AbstractZoneSelection";

export class ZoneSelection extends AbstractZoneSelection {
  isSelecting: boolean;

  constructor(stage: PIXI.Container) {
    super(stage);
    this.isSelecting = false;
  }

  startSelection(x: number, y: number) {
    this.isSelecting = true;
    this.setStartPoint({ x, y });
  }

  /* Will be called on mousemove event, only if isSelecting is true and will only update the endX and endY values */
  updateSelection(x: number, y: number) {
    const { startX, startY } = this.getPosition();
    if (startX === undefined || startY === undefined) return;

    if (this.isSelecting) {
      this.setEndPoint({ x, y });
      this.draw();
    }
  }

  endSelection() {
    this.isSelecting = false;
    this.destroy();
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
