import * as PIXI from "pixi.js";
import { CursorData, Position } from "../../types";
import { Ripple } from "./Ripple";
import {
  getAbsolutePositionFromRelativePosition,
  getRelativePositionFromAbsolutePosition,
} from "../utils/pixel";
import { MainCursor } from "./MainCursor";
import { VirtualCursor } from "./VirtualCursor";
import { ZoneSelection } from "./ZoneSelection";
import { Socket } from "socket.io-client";
import { VirtualZoneSelection } from "./VirtualZoneSelection";

export class App extends PIXI.Application {
  id: string; // Socket id
  cursorCollection: Array<PIXI.Sprite | PIXI.Graphics>;
  zoneSelection: ZoneSelection;
  virtualZoneSelections: Array<VirtualZoneSelection>;

  constructor(socket: Socket) {
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
    this.id = socket.id;
    this.zoneSelection = new ZoneSelection(this.stage, socket);
    this.virtualZoneSelections = [];
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

  onMouseUp = () => {
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

  onClick = () => {
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

  addCursor(cursor: MainCursor | VirtualCursor) {
    this.cursorCollection.push(cursor);
    this.stage.addChild(cursor as PIXI.DisplayObject);
  }

  addMainCursor({ x, y }: Position) {
    const mainCursor = new MainCursor(x, y);
    this.addCursor(mainCursor as MainCursor);
  }

  addVirtualCursor({ x, y, color }: Position & { color: string }) {
    const virtualCursor = new VirtualCursor(x, y, color);
    this.addCursor(virtualCursor);
  }

  addRipple(data: CursorData) {
    const { x, y, id } = data;
    const absolute = App.relativeToAbsolutePosition({ x, y });
    const isMainCursor = id === this.id;
    const color = isMainCursor ? "0x000000" : data.color;
    new Ripple(absolute.x, absolute.y, color, this.stage);
  }

  clearCursors() {
    this.cursorCollection.forEach((cursor) => {
      this.stage.removeChild(cursor as PIXI.DisplayObject);
    });
    this.cursorCollection = [];
  }

  addVirtualZoneSelection(id: string, { x, y }: Position, color?: string) {
    const absolute = App.relativeToAbsolutePosition({ x, y });
    const virtualZoneSelection = new VirtualZoneSelection(
      id,
      this.stage,
      color
    );
    virtualZoneSelection.startSelection(absolute.x, absolute.y);
    this.virtualZoneSelections.push(virtualZoneSelection);
  }

  updateVirtualZoneSelection(id: string, { x, y }: Position) {
    const currentZone = this.virtualZoneSelections.find(
      (virtualZoneSelection) => virtualZoneSelection.id === id
    );
    if (!currentZone) return;
    const absolute = App.relativeToAbsolutePosition({ x, y });
    currentZone.updateSelection(absolute.x, absolute.y);
  }

  endVirtualZoneSelection(id: string) {
    const currentZone = this.virtualZoneSelections.find(
      (virtualZoneSelection) => virtualZoneSelection.id === id
    );
    if (!currentZone) return;
    currentZone.destroy();
    this.virtualZoneSelections = this.virtualZoneSelections.filter(
      (virtualZoneSelection) => virtualZoneSelection.id !== id
    );
  }

  destroy() {
    return this;
  }
}
