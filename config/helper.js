const fs = require('fs');
const path = require('path');

module.exports = async (fastify) => {
  const helpersPath = path.join(__dirname, '../app/helpers');

  fs.readdirSync(helpersPath).forEach((file) => {
    if (file.endsWith('.js')) {
      const model = require(path.join(helpersPath, file));
      const modelName = path.basename(file, '.js');
      fastify.decorate('helper' + modelName.charAt(0).toUpperCase() + modelName.slice(1), model);
    }
  });
};