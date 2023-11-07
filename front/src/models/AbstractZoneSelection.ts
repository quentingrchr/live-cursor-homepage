import * as PIXI from "pixi.js";

export abstract class AbstractZoneSelection extends PIXI.Graphics {
  startX: number | undefined;
  startY: number | undefined;
  endX: number | undefined;
  endY: number | undefined;
  constructor(private stage: PIXI.Container) {
    super();
    stage.addChild(this);
    this.startX = undefined;
    this.startY = undefined;
    this.endX = undefined;
    this.endY = undefined;
  }

  setStartPoint({ x, y }: { x: number; y: number }) {
    this.startX = x;
    this.startY = y;
  }

  setEndPoint({ x, y }: { x: number; y: number }) {
    this.endX = x;
    this.endY = y;
  }

  getStartPoint() {
    return { startX: this.startX, startY: this.startY };
  }

  getEndPoint() {
    return { endX: this.endX, endY: this.endY };
  }

  getPosition() {
    return {
      startX: this.startX,
      startY: this.startY,
      endX: this.endX,
      endY: this.endY,
    };
  }

  setPosition({
    startX,
    startY,
    endX,
    endY,
  }: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }

  removePosition() {
    this.startX = undefined;
    this.startY = undefined;
    this.endX = undefined;
    this.endY = undefined;
  }

  draw() {
    if (this.startX && this.startY && this.endX && this.endY) {
      this.clear();
      this.lineStyle(2, 0xffffff, 1);
      this.beginFill(0xffffff, 0.1);
      const xIsOverflowingLeft = this.endX < this.startX;
      const yIsOverflowingTop = this.endY < this.startY;
      if (xIsOverflowingLeft && yIsOverflowingTop) {
        this.drawRect(
          this.endX,
          this.endY,
          this.startX - this.endX,
          this.startY - this.endY
        );
      }
      if (xIsOverflowingLeft && !yIsOverflowingTop) {
        this.drawRect(
          this.endX,
          this.startY,
          this.startX - this.endX,
          this.endY - this.startY
        );
      } else if (!xIsOverflowingLeft && yIsOverflowingTop) {
        this.drawRect(
          this.startX,
          this.endY,
          this.endX - this.startX,
          this.startY - this.endY
        );
      } else {
        this.drawRect(
          this.startX,
          this.startY,
          this.endX - this.startX,
          this.endY - this.startY
        );
      }

      this.endFill();
    }
  }

  destroy() {
    this.clear();
    this.removePosition();
    if (this.stage) {
      this.stage.removeChild(this);
    }
  }
}