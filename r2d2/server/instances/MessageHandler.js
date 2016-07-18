
function escape(val) {
    return val.replace('&', '&amp;')
              .replace('<', '&lt;')
              .replace('>', '&gt;');
}

function sendAsBot(resp, msg, botname) {
    var req = {
        channel: resp.channel,
        as_user: false,
        username: botname||'R2Dot',
        icon_url: 'http://lorempixel.com/48/48/people?v='+Date.now()
    };
    if ( msg.constructor == String ) {
        req.text = msg;
    } else {
        mergeObjects(req, msg);
    }
    
    slack_bot.reply(resp, req);
}


function parseMessage() {
    var base = Array.prototype.splice.call(arguments, 0, 1)[0].trim().split(/[\s\,]+/g);
    var result = {};
    for ( var i = 0, len = Math.min(arguments.length, base.length); i < len; i++ ) {
        def(arguments[i]) && (result[arguments[i]] = base[i]);
    }
    if ( base.length > arguments.length ) {
        result.args = base.slice(arguments.length);
    }
    return result;
}


var statusToColor = {
    'def': '#000000',
    'new': '#eeeeee',
    'to_do': '#009ad6',
    'in_progress': '#ffc014',
    'done': '#44d600',
    'cancelled': '#44d600'
}

function formatJiraUser(user) {
    if ( !user ) {
        return {
            displayName: 'Unassigned'
        }
    }
    return user;
}

function formatIssue2(issue) {
    if ( !issue ) { return null; }
    var req = {
        title: [issue.key, issue.fields.status.name].join(': '),
        title_link: issue.self,
        text: issue.fields.summary,
        color: statusToColor[issue.fields.status.name.toLowerCase().replace(/\s+/,'_')]
    };
    if (issue.fields.assignee ) {
        mergeObjects(req, {
            author_name: issue.fields.assignee.displayName,
            author_link: issue.fields.assignee.self,
        });
    }
    return req;
}


// Reporter: Name
// Assignee: Name
// Severity: Major
// Labels: <List>
// Status: New

// Task Name

// Short description
function formatIssue(issue) {
    if ( !issue ) { return null; }
    console.log('\n\n',issue,'\n\n');
    var req = {
        fields: [],
        color: statusToColor[issue.fields.status.name.toLowerCase().replace(/\s+/,'_')]
    };
    
    issue.fields.reporter = formatJiraUser(issue.fields.reporter);
    issue.fields.assignee = formatJiraUser(issue.fields.assignee);
    
    req.fields.push({
        title: 'Reporter',
        value: issue.fields.reporter.displayName,
        short: true
    });
    req.fields.push({
        title: 'Assignee',
        value: issue.fields.assignee.displayName,
        short: true
    });
    
    req.fields.push({
        title: 'Severity',
        value: issue.fields.priority.name,
        short: true
    });
    
    req.fields.push({
        title: 'Labels',
        value: issue.fields.labels.join(' '),
        short: true
    });
    
    req.fields.push({
        title: 'Status',
        value: issue.fields.status.name,
        short: true
    });
    
    req.title = issue.fields.summary;
    req.title_link = [config.jira.protocol,config.jira.host,'/',config.jira.path.task,issue.key].join('');
    req.footer = issue.fields.description;
    return req;
}



MODEL.MessageHandler.declare.push(()=>{
    
    // status
    new MessageHandler('status', (self, t, user, resp)=> {
        sendAsBot(resp, `${escape(user.name)}`,'STATUS');
    });
    
    // hello
    new MessageHandler(/(^|\W)(hello|hi|yo)($|\W)/gi, (self, text, user, resp) => {
        sendAsBot(resp, `Hi, ${escape(user.name)}`);
    } );
    
    // tasks summary
    new MessageHandler(/(^|\W)tasks($|\W)/gi, (self, text, user, slackResp) => {
        var req = parseMessage(text, null, 'name', 'status');
        req.status = req.status || 'available';
        
        if ( !req.name || req.name == 'me' ) {
            req.name = user.jira_name;
        }
        
        if ( !req.name ) {
            sendAsBot(slackResp, 'Failed to identify user');
            return 0;
        }
        
        jira.searchJira(`status in (${config.jira.status[req.status]}) AND assignee in (${req.name}) order by updated DESC`, req.options, (error, resp) => {
            
            var msgData = {
                text: `${escape(req.name)}: tasks with status ${escape(req.status)}`,
                attachments: []
            }
            
            resp.issues.forEach(issue => {
                
                console.log('\n\n',issue, '\n', issue.fields.assignee.avatarUrls,'\n\n');
                
                msgData.attachments.push(formatIssue(issue));
            });
            sendAsBot(slackResp, msgData);
            
        });
        
    } );
    
    // task mention
    new MessageHandler(/(^|\W)([A-Z0-9]+\-\d+)($|\W)/g, (self, text, user, slackResp) => {
        var msgData = {
            text: '',
            attachments: []
        }
        var pms = [];
        text.replace(/(^|\W)([A-Z0-9]+\-\d+)($|\W)/g, (t1,t2,issueNumber) => {
            pms.push(new Promise(done => {
                jira.findIssue(issueNumber, function(error, issue) {
                    msgData.attachments.push(formatIssue(issue));
                    done();
                });
            }));
            
        });
        
        Promise.all(pms).then(done => {
            sendAsBot(slackResp, msgData);
            done();
        });
        
    } );
    
});
