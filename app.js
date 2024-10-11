require('dotenv').config();

const fastify = require('fastify')({
  logger: true
});

require('./config/socket')(fastify);
require('./config/helper')(fastify);
require('./config/model')(fastify);
require('./config/config')(fastify);
require('./config/routes')(fastify);

if (typeof (PhusionPassenger) != 'undefined') {
  PhusionPassenger.configure({
    autoInstall: false
  });
}

const port = process.env.APP_PORT || 3000;
const start = async () => {
  var server = process.env.APP_HOST;

  try {
    if (typeof (PhusionPassenger) !== 'undefined') {
      fastify.listen({
        path: 'passenger',
        host: '127.0.0.1'
      })
    } else {
      fastify.listen(port)
      server += ':' + port;
    }

    fastify.log.info(`Server running at ${server}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();