import { Server } from "socket.io"
import http from "http"
import express from "express"
import { sendMessage } from "../controllers/message.controller"

const app = express()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3003", "http://172.16.3.155:3003/"],
        methods: ['GET', 'POST']
    }
})

const map = new Map()

io.on("connection", (socket) => {

    console.log('User connected:', socket.id);
    // console.dir( socket.handshake.query, {depth: null});
    map.set(socket.handshake.query.userId, socket.id)

    socket.on('chat message', (data) => sendMessage({data, io, map}));

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
})

export { io, app, server }