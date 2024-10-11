require('dotenv').config();

const {
  Server
} = require('socket.io');

const Cors = process.env.CORS_ORIGINS.split(',');
module.exports = (fastify) => {
  const io = new Server(fastify.server, {
    cors: {
      origin: (origin, cb) => {
        if (!origin || Cors.some(domain => new RegExp(domain.replace(/\*/g, '.*')).test(origin))) {
          cb(null, true);
        } else {
          cb(new Error('Not allowed'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
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