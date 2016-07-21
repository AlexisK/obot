const MessageHandlerModel = require('../message-handler.model');
const jiraService = require('../../../server/services/connections.service').jira;
const messageFactoryService = require('../message-factory.service.js');

const reg = /(^|\W)([A-Z0-9]+\-\d+)($|\W)/g;

module.exports = new MessageHandlerModel(reg, (text, user, resp) => {
    var issues = [];
    var promises = [];
    var requestedIssues = [];

    text.replace(new RegExp(reg), (match, char, issueNumber) => {
        if ( requestedIssues.indexOf(issueNumber) == -1 ) {
            promises.push(new Promise((resolve , reject)=> {
                requestedIssues.push(issueNumber);
                jiraService.findIssue(issueNumber, (error, issue) => {

                    if (issue) {
                        issues.push(issue);
                        resolve(issue);
                    } else {
                        console.error(`Could not find task ${issueNumber}\n`, error);
                        reject(error);
                    }

                });
            }));
        }
    });

    Promise.all(promises).then(() => {
        messageFactoryService.sendFormattedMessage(resp, require('../message-formats/jira-task-full.message-format'), issues);
    });

});
