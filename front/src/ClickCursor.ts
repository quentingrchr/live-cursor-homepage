import * as PIXI from "pixi.js";
// @ts-ignore
import svg from "./assets/images/main-cursor.svg";

export class ClickCursor extends PIXI.Graphics {
  constructor(x: number = 0, y: number = 0) {
    super();
    this.beginFill(0x000000);
    this.drawCircle(0, 0, 10);
    this.endFill();
    this.width = 20;
    this.height = 20;
    this.x = x;
    this.y = y;
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
