import * as PIXI from "pixi.js";
import { CursorData } from "../types";
import { ClickAnimation } from "./ClickAnimation";

export class App extends PIXI.Application {
  id: string; // Socket id
  cursorCollection: Array<PIXI.Sprite | PIXI.Graphics>;

  constructor(id: string) {
    const $canva = document.querySelector("#canvas") as Element;
    super({
      background: "red",
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resizeTo: window,
      view: $canva as HTMLCanvasElement,
      resolution: 2,
    });
    this.id = id;
    PIXI.settings.RESOLUTION = window.devicePixelRatio;
    let windowScreenWith = window.innerWidth;
    let windowScreenHeight = window.innerHeight;
    window.addEventListener("resize", () => {
      windowScreenWith = window.innerWidth;
      windowScreenHeight = window.innerHeight;
      this.renderer.resize(windowScreenWith, windowScreenHeight);
    });

    // Variable
    this.cursorCollection = [];
  }

  create() {
    return this;
  }

  update() {
    return this;
  }

  addCursor(cursor: PIXI.Sprite | PIXI.Graphics) {
    this.cursorCollection.push(cursor);
    this.stage.addChild(cursor);
  }

  addCursorClickAnimation(data: CursorData) {
    const { x, y, id } = data;
    const isMainCursor = id === this.id;
    const color = isMainCursor ? "0x000000" : data.color;
    const clickAnimation = new ClickAnimation(x, y, color, this.stage);
  }

  clearCursors() {
    this.cursorCollection.forEach((cursor) => {
      this.stage.removeChild(cursor);
    });
    this.cursorCollection = [];
  }

  destroy() {
    return this;
  }
}
