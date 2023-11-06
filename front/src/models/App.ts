import * as PIXI from "pixi.js";
import { CursorData, Position } from "../types";
import { ClickAnimation } from "./ClickAnimation";
import {
  getAbsolutePositionFromRelativePosition,
  getRelativePositionFromAbsolutePosition,
} from "../utils/pixel";
import { MainCursor } from "./MainCursor";
import { VirtualCursor } from "./VirtualCursor";
import { ZoneSelection } from "./ZoneSelection";

export class App extends PIXI.Application {
  id: string; // Socket id
  cursorCollection: Array<PIXI.Sprite | PIXI.Graphics>;
  zoneSelection: ZoneSelection;

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
    this.zoneSelection = new ZoneSelection(this.stage);
    this.setup();

    // Variable
    this.cursorCollection = [];
  }

  setup() {
    this.initEventListeners();
    PIXI.settings.RESOLUTION = window.devicePixelRatio;
  }

  static absoluteToRelativePosition(position: Position) {
    return getRelativePositionFromAbsolutePosition(position, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  static relativeToAbsolutePosition(position: Position) {
    return getAbsolutePositionFromRelativePosition(position, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  onMouseDown = (e: MouseEvent) => {
    this.zoneSelection.startSelection(e.clientX, e.clientY);
    window.addEventListener("mousemove", this.onMouseMove);
  };

  onMouseMove = (e: MouseEvent) => {
    this.zoneSelection.updateSelection(e.clientX, e.clientY);
  };

  onMouseUp = (e: MouseEvent) => {
    this.zoneSelection.endSelection();
    window.removeEventListener("mousemove", this.onMouseMove);
  };

  onResize = () => {
    let windowScreenWith = window.innerWidth;
    let windowScreenHeight = window.innerHeight;
    windowScreenWith = window.innerWidth;
    windowScreenHeight = window.innerHeight;
    this.renderer.resize(windowScreenWith, windowScreenHeight);
  };

  onClick = (e: MouseEvent) => {
    if (!this.zoneSelection.getIsSelecting()) {
      this.zoneSelection.clearSelection();
      return;
    }
  };

  initEventListeners() {
    window.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("click", this.onClick);
    window.addEventListener("resize", this.onResize);
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

  addMainCursor({ x, y }: Position) {
    const mainCursor = new MainCursor(x, y);
    this.addCursor(mainCursor);
  }

  addVirtualCursor({ x, y, color }: Position & { color: string }) {
    const virtualCursor = new VirtualCursor(x, y, color);
    this.addCursor(virtualCursor);
  }

  addCursorClickAnimation(data: CursorData) {
    const { x, y, id } = data;
    const absolute = App.relativeToAbsolutePosition({ x, y });
    const isMainCursor = id === this.id;
    const color = isMainCursor ? "0x000000" : data.color;
    new ClickAnimation(absolute.x, absolute.y, color, this.stage);
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
