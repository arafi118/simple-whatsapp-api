require('dotenv').config();

const fastify = require('fastify')({
  logger: true
});

require('./config/socket')(fastify);
require('./config/helper')(fastify);
require('./config/model')(fastify);
require('./config/config')(fastify);
require('./config/routes')(fastify);

const port = process.env.APP_PORT || 3000;
const start = async () => {
  var server = process.env.APP_HOST;

  try {
    fastify.listen({
      port
    })
    server += ':' + port;

    fastify.log.info(`Server running at ${server}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();