const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({port : 3000});

require('./server').orm.init().then(db => {
  require('./nodes');

  server.start((err) => {
    if ( err ) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
});


