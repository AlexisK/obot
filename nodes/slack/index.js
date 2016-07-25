const Node = require('../../models/node.model');

const config     = require('./slack.config');
const connection = require('./slack.connection');
const handler    = require('./ping.handler');

module.exports = new Node({config, connection, handler});
