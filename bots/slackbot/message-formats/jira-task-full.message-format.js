const JIRACONF = require('../../../config/jira');
const MessageFormatService = require('../message-format.service.js');

module.exports = issue => {
    var req = {
        color: '#eee'
    };

    issue.fields.reporter = MessageFormatService.formatJiraUser(issue.fields.reporter);
    issue.fields.assignee = MessageFormatService.formatJiraUser(issue.fields.assignee);

    req.fields = MessageFormatService.createSlackFields({
        'Reporter' : issue.fields.reporter.displayName,
        'Assignee' : issue.fields.assignee.displayName,
        'Severity' : issue.fields.priority.name,
        'Labels'   : issue.fields.labels.join(' '),
        'Status'   : issue.fields.status.name
    });

    req.title = issue.fields.summary;
    req.title_link = `${JIRACONF.protocol}://${JIRACONF.host}/${JIRACONF.path.task}${issue.key}`;
    req.footer = issue.fields.description;

    return req;
};
