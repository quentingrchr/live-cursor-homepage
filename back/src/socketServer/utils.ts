import { VIRTUAL_CURSOR_COLORS } from "../constants/cursor";
import { CursorState } from "../types";

export function registerCursor(id: string, state: CursorState) {
  const color =
    VIRTUAL_CURSOR_COLORS[
      Math.floor(Math.random() * VIRTUAL_CURSOR_COLORS.length)
    ];

  state[id] = {
    id,
    x: 0,
    y: 0,
    color,
  };
}

export function getCursorColor(id: string, state: CursorState) {
  return state[id].color;
}
