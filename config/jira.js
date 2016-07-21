const JIRA_CONFIG = require('./../settings.json');

const { JIRA_USER, JIRA_PASSWORD } = JIRA_CONFIG;

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
