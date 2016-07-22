const Node = require('../../models/node.model');

const config = require('./gitlab.config');
const connection = require('./gitlab.connection');

module.exports = new Node({ config, connection });
