import * as PIXI from "pixi.js";
// @ts-ignore
import svg from "./assets/images/main-cursor.svg";
import { io } from "socket.io-client";
import { MainCursor } from "./models/MainCursor";
import { App } from "./models/App";

export function createMainCursorSprite(svg: any) {
  const texture = PIXI.Texture.from(svg);
  const sprite = PIXI.Sprite.from(texture);
  sprite.width = 20;
  sprite.height = 20;
  window.addEventListener("mousemove", (e) => {
    sprite.x = e.clientX;
    sprite.y = e.clientY;
  });
  return sprite;
}

export function createVirtualCursorSprite({ x = 0, y = 0 }) {
  const sprite = new PIXI.Graphics();
  sprite.beginFill(0x000000);
  sprite.drawCircle(0, 0, 10);
  sprite.endFill();
  window.addEventListener("mousemove", () => {
    sprite.x = x;
    sprite.y = y;
  });
  return sprite;
}

export async function getPixiApp() {}
