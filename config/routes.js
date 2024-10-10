module.exports = (fastify, io) => {
  const routes = require('../routes/routes');

  Object.keys(routes).forEach((route) => {
    const [method, url] = route.split(' ');
    const handler = routes[route];

    console.log('handler', handler);

    if (typeof handler === 'function') {
      fastify.route({
        method,
        url,
        handler: async (req, reply) => {
          return handler(req, reply);
        },
      });
    } else if (typeof handler === 'string') {
      const [controller, action] = handler.split('.');
      const ControllerInstance = require(`../app/controllers/${controller}`);

      fastify.route({
        method,
        url,
        handler: ControllerInstance[action],
      });
    }
  });
};