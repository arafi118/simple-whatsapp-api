require('dotenv').config();

const path = require('path');

const Cors = process.env.CORS_ORIGINS.split(',');
module.exports = (fastify) => {
  fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '../resources/assets'),
    prefix: '/assets/',
  });

  fastify.register(require('@fastify/cors'), {
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
  });

  fastify.register(require('@fastify/view'), {
    engine: {
      ejs: require('ejs'),
    },
    root: path.join(__dirname, '../resources', 'views'),
  });
};