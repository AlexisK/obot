const Node = require('../../models/node.model');

const handler = require('./weather.handler');
const formatter = require('./weather.formatter');

module.exports = new Node({ handler, formatter });
