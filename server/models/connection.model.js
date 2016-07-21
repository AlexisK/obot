const JiraApi = require('jira').JiraApi;
const SlackBot = require('botkit').slackbot;
const slackConf = require('../../config/slack.js');
const emitter = require('../services/event-emitter');

const connections = {
    jira: (config) => new JiraApi(config.protocol, config.host, config.port, config.user, config.password, config.apiVersion),
    slack: (config) => {
        const slack = SlackBot({debug: false});
        const bot = slack.spawn({
            token: config.token
        }).startRTM();

        slack.hears('', ['direct_message', 'direct_mention', 'mention', 'ambient'], (bot, message) =>
            emitter.emit(slackConf.eventName, bot, message)
        );

        return bot;
    },
    gitlab: (config) => {
        return require('gitlab')({
            url: config.url,
            token: config.token
        });
    }
};

module.exports = class Connection {
    constructor(name) {
        this._name = name;
        this.config = require(`../../config/${this._name}`);
        if (!this.config) { console.error(`Connection: Failed to load config for ${name}`); }
        this.connection = connections[name];
    }

    connect() {
        const response = this.connection(this.config);
        if(!!response) { return response; }
        console.error(`Connection: Failed to connect for ${this._name}`);
    }
};
