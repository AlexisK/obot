const fs = require('fs');
const path = require('path');

const formatFileName = function(filename) {
  let pieces = filename.split('.');
  pieces.pop();

  return pieces[0] + pieces.slice(1).map(word => { return word.charAt(0).toUpperCase() + word.slice(1); }).join('');
};

module.exports = function requireModules(dir) {
  const modules = {};

  fs.readdirSync(dir)
    .forEach((file) => {
       if (file === 'index.js') { return; }

       modules[formatFileName(file)] = require(path.resolve(dir, file));
    });

  return modules;
};
