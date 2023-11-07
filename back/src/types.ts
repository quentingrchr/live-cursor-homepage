export interface Position {
  x: number;
  y: number;
}

export interface CursorData extends Position {
  id: string;
  color: string;
}

export interface StartSelectionPayload {
  id: string;
  x: number;
  y: number;
}

export interface UpdateSelectionPayload {
  id: string;
  x: number;
  y: number;
}
