import { Server } from "socket.io";
import http from "http";
import express from "express";
import { sendMessage, sendTypingStatus } from "../controllers/message.controller";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      const allowed = ["http://localhost:3003", "https://chat.tungstenz.online"];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const map = new Map();
const ids = new Map();

io.on("connection", (socket) => {
    let userId = socket.handshake.query.userId;
    if (userId) {
        map.set(userId, socket.id);
        ids.set(socket.id, userId);
        io.emit("online", [...map.keys()]);
    }

    socket.on("typing", (data) => sendTypingStatus({data, io, map}))

    socket.on("chat message", (data) => sendMessage({ data, io, map }));

    socket.on("disconnect", () => {
        map.delete(ids.get(socket.id));
        ids.delete(socket.id);
        io.emit("online", [...map.keys()]);
    });
});

export { io, app, server };
