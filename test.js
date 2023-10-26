const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Replace with the actual origin you want to allow
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    const userIP = socket.handshake.address;
    console.log(userIP);
    console.log('A user connected');

    let x = true;
    socket.on('chat message', (message) => {
       while (x === true){
       io.emit('chat message', message);
       console.log('messages sent');
       x = false;
       };
       setInterval(() => {
        x = true;
       },100);
    });

    socket.on("onuser", (t) => {
        io.emit("usern", t);
        console.log('Sent', t);
    });

    socket.on("out", (w) => {
        if (w === "jack") {
            server.close(() => {
                console.log("Server shutdown");
            });
        }
        io.emit("out", w);
        console.log(w + " logged out");
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
    console.log(`Server is up and running, server listening on port ${PORT}.`);
});
