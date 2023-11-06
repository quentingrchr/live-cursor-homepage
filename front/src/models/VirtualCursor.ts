import * as PIXI from "pixi.js";
// @ts-ignore
import svg from "../assets/images/virtual-cursor.svg";

export class VirtualCursor extends PIXI.Sprite {
  constructor(x: number, y: number, color: string) {
    const texture = PIXI.Texture.from(svg);
    super(texture);
    this.width = 20;
    this.height = 20;
    this.tint = parseInt(color.replace("#", "0x"));
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
