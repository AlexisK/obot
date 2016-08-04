const JiraApi = require('jira-client');

import { Connection } from '../../core/models/connection';

const { protocol, host, port, user, password, apiVersion } = require('./settings');

export const connection = new Connection('Jira', function () {
  return new JiraApi({ protocol, host, port, user, password, apiVersion });
});
