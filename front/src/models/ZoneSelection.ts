import * as PIXI from "pixi.js";

export class ZoneSelection extends PIXI.Graphics {
  isSelecting: boolean;
  startX: number | undefined;
  startY: number | undefined;
  endX: number | undefined;
  endY: number | undefined;

  constructor(stage: PIXI.Container) {
    super();
    stage.addChild(this);
    console.log("ZoneSelection constructor");
    this.isSelecting = false;
    this.startX = undefined;
    this.startY = undefined;
    this.endX = undefined;
    this.endY = undefined;
  }

  startSelection(x: number, y: number) {
    this.isSelecting = true;
    this.startX = x;
    this.startY = y;
  }

  /* Will be called on mousemove event, only if isSelecting is true and will only update the endX and endY values */
  updateSelection(x: number, y: number) {
    if (this.isSelecting) {
      this.endX = x;
      this.endY = y;
      this.draw();
    }
  }

  endSelection() {
    this.isSelecting = false;
  }

  clearSelection() {
    this.clear();
    this.startX = undefined;
    this.startY = undefined;
    this.endX = undefined;
    this.endY = undefined;
    this.isSelecting = false;
  }

  draw() {
    if (
      this.isSelecting &&
      this.startX &&
      this.startY &&
      this.endX &&
      this.endY
    ) {
      this.clear();
      this.lineStyle(2, 0xffffff, 1);
      this.beginFill(0xffffff, 0.1);
      this.drawRect(
        this.startX,
        this.startY,
        this.endX - this.startX,
        this.endY - this.startY
      );
      this.endFill();
    }
  }

  getIsSelecting() {
    return this.isSelecting;
  }

  create() {
    return this;
  }

  update() {
    return this;
  }

  destroy() {
    return this;
  }
}
