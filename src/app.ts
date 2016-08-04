import Hapi = require('hapi');

import { modules } from './modules';

// connect all modules
modules
  .forEach((module) =>
    module.connection.connect());

const server = new Hapi.Server();
server.connection({ port: 3000 });

server.start((err) => {
  if (err) { throw err; }
  console.log('Server running at:', server.info.uri);
});
