require('dotenv').config();

const path = require('path');

const Cors = process.env.CORS_ORIGINS.replace(/"/g, '');
module.exports = (fastify) => {
  fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '../resources/assets'),
    prefix: '/assets/',
  });

  fastify.register(require('@fastify/cors'), {
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
  });

  fastify.register(require('@fastify/view'), {
    engine: {
      ejs: require('ejs'),
    },
    root: path.join(__dirname, '../resources', 'views'),
  });
};