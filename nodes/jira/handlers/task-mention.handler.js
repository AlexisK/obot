const Handler     = require('../../../models/handler.model.js');
const jiraService = require('./../jira.connection.js');

const reg = /(^|\W)([A-Z0-9]+\-\d+)($|\W)/g;

module.exports = new Handler({
  'pattern' : reg,
  'on_ambient, on_direct, on_mention' : function (message) {

    var requestedIssues = {};

    message.text.replace(new RegExp(reg), (match, char, issueNumber) => {
      if ( !requestedIssues[issueNumber] ) {
        requestedIssues[issueNumber] = true;

        jiraService.findIssue(issueNumber, (error, issue) => {

          if ( issue ) {
            message.replyFormattedMessage(require('./../formatters/task-full.formatter.js').format(issue));
          } else {
            console.error(`Could not find task ${issueNumber}\n`, error);
          }

        });
        //  end jiraService.findIssue
      }
    });

  }
});
