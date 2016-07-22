const Node = require('../../models/node.model');

const config = require('./jira.config');
const connection = require('./jira.connection');

module.exports = new Node({ config, connection });
