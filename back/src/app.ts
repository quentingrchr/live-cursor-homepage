import express from "express";
import http from "http";
import configureSocketServer from "./socketServer/server";
import cors from "cors";

const app = express();
const server = http.createServer(app);
app.use(cors());

configureSocketServer(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Express and Socket.io server is running on port ${PORT}`);
});
