const Node = require('../../models/node.model');

const config     = require('./slack.config');
const connection = require('./slack.connection');
const handler    = require('./ping.handler');
//const migrations = require('../../server/orm.service').migrate('nodes/slack');

require('../../utils/merge-migrations.util')(__dirname, 'slack');

module.exports = new Node({config, connection, handler});
