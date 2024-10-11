require('dotenv').config();

const path = require('path');

const Cors = process.env.CORS_ORIGINS.split(',');
module.exports = (fastify) => {
  fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '../resources/assets'),
    prefix: '/assets/',
  });

  fastify.register(require('@fastify/cors'), {
    origin: (origin, cb) => {
      if (!origin || Cors.some(domain => new RegExp(domain.replace(/\*/g, '.*')).test(origin))) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed'));
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