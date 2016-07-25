const path = require('path');
const Node = require('../../models/node.model');

const config = require('./jira.config');
const connection = require('./jira.connection');
const handlers = require('../../utils/require.util')(path.resolve(__dirname, './handlers'));
const formatters = require('../../utils/require.util')(path.resolve(__dirname, './formatters'));

module.exports = new Node({ config, connection, handlers, formatters });
