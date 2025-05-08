const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 3000;

app.use(express.static('public'));

let players = {};

io.on('connection', socket => {
    console.log(`Player connected: ${socket.id}`);

    players[socket.id] = {
        x: Math.floor(Math.random() * 800),
        y: Math.floor(Math.random() * 600)
    };

    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] });

    socket.on('playerMovement', data => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            socket.broadcast.emit('playerMoved', { id: socket.id, x: data.x, y: data.y });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

http.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://192.168.1.140:${PORT}`);
});

