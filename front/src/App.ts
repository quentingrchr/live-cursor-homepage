import * as PIXI from "pixi.js";

export class App extends PIXI.Application {
  // create variables toto
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

  addClickAnimation(animation: PIXI.Sprite | PIXI.Graphics) {
    this.stage.addChild(animation);
    setTimeout(() => {
      this.stage.removeChild(animation);
    }, 1000);
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
