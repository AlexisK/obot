import {Formatter} from '../../../core/models/formatter';
import {formatSlackFields} from '../../../core/utils/format-slack-fields';
import {settings} from '../settings';
const {protocol, host, path} = settings;

const formatJiraUser = function (user) {
  if (!user) {
    return {
      displayName: 'Unassigned'
    }
  }
  return user;
};

class Request {
  color : string = '#eee';
  fields : any;
  title : string;
  title_link : string;
  footer : string;
}

export const taskFullFormatter = new Formatter(issue => {
  var req = new Request();

  issue.fields.reporter = formatJiraUser(issue.fields.reporter);
  issue.fields.assignee = formatJiraUser(issue.fields.assignee);

  req.fields = formatSlackFields({
    'Reporter': issue.fields.reporter.displayName,
    'Assignee': issue.fields.assignee.displayName,
    'Severity': issue.fields.priority.name,
    'Labels'  : issue.fields.labels.join(' '),
    'Status'  : issue.fields.status.name
  });

  req.title      = `${issue.key} --- ${issue.fields.summary}`;
  req.title_link = `${protocol}://${host}/${path.task}${issue.key}`;
  req.footer     = issue.fields.description;

  return req;
});
