import express from "express";
import http from "http";
import * as socketio from "socket.io";
import cors from "cors"; // Import the cors package
import { SocketEvents } from "../../shared";
import { VIRTUAL_CURSOR_COLORS } from "./constants/cursor";
import {
  CursorData,
  Position,
  StartSelectionPayload,
  UpdateSelectionPayload,
} from "./types";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new socketio.Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello, this is your TypeScript Express server!");
});

const cursorsData: Record<string, CursorData> = {};

io.on(SocketEvents.Connection, (socket) => {
  console.log(`A user connected with socket id ${socket.id}`);
  cursorsData[socket.id] = {
    id: socket.id,
    x: 0,
    y: 0,
    color:
      VIRTUAL_CURSOR_COLORS[
        Math.floor(Math.random() * VIRTUAL_CURSOR_COLORS.length)
      ],
  };

  socket.on(SocketEvents.NewPosition, (data: Position) => {
    cursorsData[socket.id] = { ...cursorsData[socket.id], ...data };

    const cursorDataArray = Object.values(cursorsData);
    io.emit(SocketEvents.PositionsUpdate, cursorDataArray as CursorData[]);
  });

  socket.on(SocketEvents.SendCursorClick, (data: Omit<CursorData, "color">) => {
    console.log(`User ${socket.id} clicked`);
    io.emit(SocketEvents.CursorClick, {
      ...data,
      color: cursorsData[socket.id].color,
    });
  });

  socket.on(SocketEvents.SendStartSelection, (data: StartSelectionPayload) => {
    console.log(`User ${socket.id} started selection`);
    io.emit(SocketEvents.SendStartSelection, {
      ...data,
      id: socket.id,
    });
  });

  socket.on(
    SocketEvents.SendUpdateSelection,
    (data: UpdateSelectionPayload) => {
      console.log(`User ${socket.id} updated selection`);
      io.emit(SocketEvents.SendUpdateSelection, {
        ...data,
        id: socket.id,
      });
    }
  );

  socket.on(SocketEvents.SendEndSelection, () => {
    console.log(`User ${socket.id} ended selection`);
    io.emit(SocketEvents.SendEndSelection, {
      id: socket.id,
    });
  });

  socket.on(SocketEvents.Disconnect, () => {
    delete cursorsData[socket.id];
    console.log(`A user disconnected with socket id ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
