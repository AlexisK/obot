const forOwn = require('lodash/forOwn');
const Formatter = require('../../../models/formatter.model.js');
const { protocol, host, path } = require('./../jira.config.js');

module.exports = new Formatter(issue => {
  var req = {
    color: '#eee'
  };

  req.title = issue.fields.summary;
  req.title_link = `${protocol}://${host}/${path.task}${issue.key}`;
  req.text = issue.fields.status.name;

  return req;
});
