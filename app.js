const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({port : 3000});

const orm = require('./server').orm;
orm.init().then(db => {
  require('./nodes');
  orm.migrate();

  server.start((err) => {
    if ( err ) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
});


