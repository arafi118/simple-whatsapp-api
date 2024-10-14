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

      const regexes = Cors.map(domain => {
        const sanitizedDomain = domain.replace('*.', '(.*\\.)?').replace(/\./g, '\\.');
        return new RegExp(`^https?:\\/\\/${sanitizedDomain}$`);
      });

      const isAllowed = regexes.some(regex => regex.test(origin));

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