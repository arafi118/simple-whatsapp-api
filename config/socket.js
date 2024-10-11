require('dotenv').config();

const {
  Server
} = require('socket.io');

const Cors = process.env.CORS_ORIGINS.replace(/"/g, '');
module.exports = (fastify) => {
  const io = new Server(fastify.server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin ||
          origin === 'http://localhost' ||
          origin === 'http://127.0.0.1' ||
          new RegExp(`^https://([a-z0-9-]+\\.)?${allowedOrigin.replace(/^https?:\/\//, '')}$`).test(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
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