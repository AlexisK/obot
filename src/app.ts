import Hapi = require('hapi');

import {orm} from './server/orm';
import {modules} from './modules';

const server = new Hapi.Server();
server.connection({port: 3000});

orm.init().then(() => {
  // connect all modules
  modules
    .forEach((module) =>
      module.connection.connect());

  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
});

