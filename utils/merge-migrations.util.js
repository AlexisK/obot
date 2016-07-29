var fs = require('fs');
const path   = require('path');
const glob   = require('glob');
const target = 'migrations';
let counter = 1;

if (!fs.existsSync(target)){
  fs.mkdirSync(target);
}

module.exports = function (dir) {
  glob(dir + '/*.migration.js', {}, (err, files) => {
    files.forEach(file => {
      let fileName = file.split('/');
      fileName = `${require('./format-number-width.util')(counter++, 4)}-${fileName[fileName.length-1]}`;
      console.log(fileName);

      fs.createReadStream(file).pipe(fs.createWriteStream(path.resolve(target,fileName)));
    });
  });
};
