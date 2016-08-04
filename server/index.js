const Hapi = require('hapi');

module.exports = {
  server : new Hapi.Server(),
  orm    : require('./orm.service')
};
