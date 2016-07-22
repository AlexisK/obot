const fs = require('fs');
const path = require('path');

module.exports = function requireModules(dir) {
  const modules = {};

  fs.readdirSync(dir)
    .forEach((file) => {
       if (file === 'index.js') { return; }

       modules[file] = require(path.resolve(dir, file));
    });

  return modules;
};
