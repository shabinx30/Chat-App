import { Server } from "socket.io";
import http from "http";
import express from "express";
import { sendMessage } from "../controllers/message.controller";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3003", "chat.tungstenz.online"],
        methods: ["GET", "POST"],
    },
});

const map = new Map();
const ids = new Map();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    let userId = socket.handshake.query.userId;
    if (userId) {
        map.set(userId, socket.id);
        ids.set(socket.id, userId);
        io.emit("online", [...map.keys()]);
    }

    socket.on("chat message", (data) => sendMessage({ data, io, map }));

    socket.on("disconnect", () => {
        map.delete(ids.get(socket.id));
        ids.delete(socket.id);
        io.emit("online", [...map.keys()]);
        console.log("User disconnected:", socket.id);
    });
});

export { io, app, server };
