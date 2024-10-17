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
      if (!origin) return cb(null, true);

      console.log(Cors, origin);

      const regexList = Cors.map(domain => {
        return new RegExp(`^https?:\/\/(.*\\.)?${domain.replace(/\./g, '\\.')}$`);
      });

      const isAllowed = regexList.some(regex => regex.test(origin));
      console.log(isAllowed);

      if (isAllowed) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  });

  fastify.register(require('@fastify/view'), {
    engine: {
      ejs: require('ejs'),
    },
    root: path.join(__dirname, '../resources', 'views'),
  });

  fastify.register(require('@fastify/formbody'));
};