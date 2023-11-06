import * as PIXI from "pixi.js";
// @ts-ignore
import svg from "./assets/images/main-cursor.svg";

export class MainCursor extends PIXI.Sprite {
  constructor(x: number = 0, y: number = 0) {
    const texture = PIXI.Texture.from(svg);
    super(texture);
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
