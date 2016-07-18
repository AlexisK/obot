var jiraApi = require('jira').JiraApi;
var SlackBot = require('botkit').slackbot;


function connect_jira() {
    var jira = new jiraApi('https', config.jira.host, config.jira.port, config.jira.user, config.jira.password, '2');
    global.jira = jira;
    console.log('Connected Jira');
}



function connect_slack() {
    var slack = SlackBot({debug: false});
    var bot = slack.spawn({
        token: config.slack.token
    }).startRTM();
    
    slack.hears('hello',['direct_message','direct_mention','mention','ambient'],function(bot,message) {
        bot.reply(message,'Hello yourself.');
    });
    
    slack.hears('^.*$',['direct_message','direct_mention','mention','ambient'],function(bot,message) {
        
        EMIT('slack/read/message', bot, message);
    });
    
    slack.on('message_received', function(bot, message) {
        
    });
    
    global.slack = slack;
    global.slack_bot = bot;
    
    console.log('Connected Slack');
}

