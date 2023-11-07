export interface Position {
  x: number;
  y: number;
}
export interface CursorData {
  id: string;
  x: number;
  y: number;
  color: string;
}

export interface SocketCursor extends Position {
  id: string;
  color: string;
}

export enum PixiEvents {
  StartClickAnimation = "start_click_animation",
}
