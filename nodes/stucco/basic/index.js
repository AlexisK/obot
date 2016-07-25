const Node = require('../../../models/node.model');

const handler = require('./dinner.handler');
const formatter = require('./dinner.formatter');

module.exports = new Node({ handler, formatter });
