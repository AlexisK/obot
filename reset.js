const orm = require('./server').orm;
orm.init().then(db => {
  orm.migrate('down');
});
