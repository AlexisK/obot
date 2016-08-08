const { JIRA_USER, JIRA_PASSWORD } = require('../../../settings.json');

export const settings = {
  protocol: 'https',
  host: 'camdenmarket.atlassian.net',
  username: JIRA_USER,
  password: JIRA_PASSWORD,
  apiVersion: '2',
  path: {
    task: 'browse/'
  }
};
