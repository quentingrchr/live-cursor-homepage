export interface Position {
  x: number;
  y: number;
}

export interface SocketCursor extends Position {
  id: string;
  color: string;
}
