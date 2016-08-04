var fs = require('fs');
const path   = require('path');
const glob   = require('glob');
const target = 'migrations';

if (!fs.existsSync(target)){
  fs.mkdirSync(target);
}

module.exports = function (dir, scope) {
  glob(dir + '/*.migration.js', {}, (err, files) => {
    files.forEach(file => {
      let fileName = file.split('/');
      fileName = fileName[fileName.length-1];

      if ( scope ) {
        fileName = `002-[${scope}]-${fileName}`;
      } else {
        fileName = `001-[basic]-${fileName}`;
      }

      let indName = fileName.replace(/^\d+\-/,'');



      fs.createReadStream(file).pipe(fs.createWriteStream(path.resolve(target,fileName)));
    });
  });
};
