require('dotenv').config();

const {
  Server
} = require('socket.io');

const Cors = process.env.CORS_ORIGINS.split(',');
module.exports = (fastify) => {
  const io = new Server(fastify.server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const validasi = Cors.some(domain => {
          const regex = new RegExp(domain.replace(/\*/g, '.*'));
          return regex.test(origin);
        });

        if (validasi) {
          callback(null, true);
        } else {
          callback(new Error('Domain tidak terdaftar'));
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