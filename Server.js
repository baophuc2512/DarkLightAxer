// Parameters
var sitePath = process.argv[2] || ".";
var port = process.env.PORT || 4242;

// Libraries
var express = require('express');
var app = express();

// Request logging
app.use(function (req, res, next) {
    console.log(req.url);
    next();
});

// Start server
console.log(sitePath);
console.log("Starting server in: " + __dirname + '/' + sitePath);
app.use(express.static(__dirname + '/' + sitePath));

// app.listen(port, function () {
//     console.log("Server running at: http://localhost:" + port);
// });

// Socket io
var server = require('http').Server(app);
var io = require('socket.io')(server, {
    pingTimeout: 30000
});

server.listen(port, () => {
    console.log("Server running at: http://localhost:" + port);
});

var players = {};

io.on('connection', (socket) => {
    console.log('a user connected');
    // Todo
    // create a new player and add it to our players object
    players[socket.id] = {
        rotation: 0,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
    };

    // send the players object to the new player
    socket.emit('currentPlayer', socket.id);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', socket.id);

    // when a player disconnects, remove them from our players object
    socket.on('disconnect', function () {
        try {
            console.log('user disconnected');
            // emit a message to all players to remove this player
            socket.broadcast.emit('disconnectPlayer', socket.id);
        } catch (e) {
            console.log(e);
        }
    });

    socket.on('test', function () {
        console.log('test received');
    });

    socket.on('move', function (isLeft) {
        console.log('move received at server', isLeft);
        socket.broadcast.emit('movePlayer', isLeft, socket.id);
    });

    socket.on('stop', function () {
        socket.broadcast.emit('stopPlayer', socket.id);
    });
});

