import { connection } from '../connection';
import {Handler} from '../../../core/models/handler';
import {taskFullFormatter} from '../formatters/task-full';

const pattern = /(^|\W)([A-Z0-9]+-\d+)($|\W)/g;

export const taskMention = new Handler({
  pattern,
  'ambient, direct, mention': (message : any) => {
    let requestedIssues = {};
    for (let regexp = new RegExp(<string>pattern), match; match = regexp.exec(message.text);) {
      let issueNumber = match[2];
      if ( !requestedIssues[issueNumber] ) {
        requestedIssues[issueNumber] = true;

        connection.service.findIssue(issueNumber).then(issue => {
          message.reply(taskFullFormatter.format(issue));
        }).catch(error => {
          console.error(`Could not find task ${issueNumber}\n`, error);
        });

      }
    }
  }
});
