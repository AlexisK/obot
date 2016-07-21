const Connection = require('../models/connection.model');

const jira = new Connection('jira').connect();
const slack = new Connection('slack').connect();
const gitlab = new Connection('gitlab').connect();

module.exports = { jira, slack, gitlab };
