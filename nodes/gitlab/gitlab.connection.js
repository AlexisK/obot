const Connection = require('../../models/connection.model');
const { url , token } = require('./gitlab.config');

module.exports = new Connection('gitlab', () => {
  return require('gitlab')({
    url, token
  });
}).connect();
