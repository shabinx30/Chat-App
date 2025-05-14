import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3003"],
        methods: ['GET', 'POST']
    }
})

io.on("connection", (socket) => {

    console.log('User connected:', socket.id);

    socket.on('chat message', (msg) => {
        console.log(`message came: ${msg}`)
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
})

export { io, app, server }