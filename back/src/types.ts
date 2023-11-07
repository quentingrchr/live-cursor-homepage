export interface Position {
  x: number;
  y: number;
}

export interface CursorData extends Position {
  id: string;
  color: string;
}

export interface SendStartSelectionPayload {
  id: string;
  startX: number;
  startY: number;
}

export interface SendUpdateSelectionPayload {
  id: string;
  endX: number;
  endY: number;
}

export type CursorState = Record<string, CursorData>;
