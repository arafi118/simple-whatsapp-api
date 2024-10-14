require('dotenv').config();

const {
  Server
} = require('socket.io');

module.exports = (fastify) => {
  const io = new Server(fastify.server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.emit('connected', {
      id: socket.id
    });

    socket.on('message', (msg) => {
      console.log(`Message received: ${msg}`);
      io.emit('message', msg);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  fastify.decorate('io', io);
}