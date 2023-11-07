export default "foo";

export enum SocketEvents {
  Connection = "connection",
  Disconnect = "disconnect",
  NewPosition = "new_position",
  PositionsUpdate = "positions_update",
  SendCursorClick = "send_cursor_click",
  CursorClick = "cursor_click",
  SendStartSelection = "send_start_selection",
  SendUpdateSelection = "send_update_selection",
  SendEndSelection = "send_end_selection",
}
