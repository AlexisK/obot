const forOwn = require('lodash/forOwn');
const Formatter = require('../../../models/formatter.model.js');
const { protocol, host, path } = require('./../jira.config.js');

const formatJiraUser = function(user) {
  if ( !user ) {
    return {
      displayName: 'Unassigned'
    }
  }
  return user;
};

const createSlackFields = function(rules) {
  var fieldList = [];
  forOwn(rules, (value, key) => {
    fieldList.push({
      title: key,
      value: value,
      short: true
    });
  });
  return fieldList;
};

module.exports = new Formatter(issue => {
  var req = {
    color: '#eee'
  };

  issue.fields.reporter = formatJiraUser(issue.fields.reporter);
  issue.fields.assignee = formatJiraUser(issue.fields.assignee);

  req.fields = createSlackFields({
    'Reporter' : issue.fields.reporter.displayName,
    'Assignee' : issue.fields.assignee.displayName,
    'Severity' : issue.fields.priority.name,
    'Labels'   : issue.fields.labels.join(' '),
    'Status'   : issue.fields.status.name
  });

  req.title = issue.fields.summary;
  req.title_link = `${protocol}://${host}/${path.task}${issue.key}`;
  req.footer = issue.fields.description;

  return req;
});
