const Node = require('../../../models/node.model');

const handlers = require('../../../utils/require.util')(__dirname);

module.exports = new Node({ handlers });
