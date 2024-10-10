const fs = require('fs');
const path = require('path');

module.exports = async (fastify) => {
  const modelsPath = path.join(__dirname, '../app/models');

  fs.readdirSync(modelsPath).forEach((file) => {
    if (file.endsWith('.js')) {
      const model = require(path.join(modelsPath, file));
      const modelName = path.basename(file, '.js');
      fastify.decorate(modelName.charAt(0).toUpperCase() + modelName.slice(1), model);
    }
  });
};