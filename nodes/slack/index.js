const Node = require('../../models/node.model');

const config     = require('./slack.config');
const connection = require('./slack.connection');
const handler    = require('./ping.handler');
const ormModel   = require('./user.orm-model');
//const migrations = require('../../server/orm.service').migrate('nodes/slack');

module.exports = new Node({config, connection, handler, ormModel});
