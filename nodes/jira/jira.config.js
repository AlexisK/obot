const { JIRA_USER, JIRA_PASSWORD } = require('../../settings.global.json');

module.exports = {
  protocol: 'https',
  host: 'camdenmarket.atlassian.net',
  port: '443',
  user: JIRA_USER,
  password: JIRA_PASSWORD,
  apiVersion: '2',
  path: {
    task: 'browse/'
  }
};
