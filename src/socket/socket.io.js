const socket = require('socket.io');

module.exports.listen = function (server) {

    const io = socket(server);

    io.on('connection', socket => {

        socket.on('vehicle-arrival', vehicle => {
            socket.broadcast.emit('vehicle-action', vehicle);
        });

        socket.on('vehicle-departure', vehicle => {
            socket.broadcast.emit('vehicle-action', vehicle);
        });
    });

    return io;
}

