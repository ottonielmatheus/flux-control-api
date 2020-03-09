const app = require('./app');
const server = require('http').createServer(app);
const socket = require('../src/socket/socket.io').listen(server);

server.listen(process.env.PORT || 8080);