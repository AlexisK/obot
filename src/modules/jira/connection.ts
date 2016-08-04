const JiraApi = require('jira-client');

import { Connection } from '../../core/models/connection';

const { settings } = require('./settings');
const { protocol, host, username, password, apiVersion } = settings;

export const connection = new Connection('Jira', function () {
  return new JiraApi({ protocol, host, username, password, apiVersion, strictSSL: true });
});
