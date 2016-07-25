const Connection = require('../../models/connection.model');
const { protocol, host, port, user, password, apiVersion } = require('./jira.config');

module.exports = new Connection('jira', ()=> {
  const JiraApi = require('jira').JiraApi;
  return new JiraApi(protocol, host, port, user, password, apiVersion);
}).connect();
