const SLACK_CONFIG = require('./../settings.json');

const { SLACK_BOT_TOKEN, SLACK_BOT_NAME, SLACK_BOT_IMAGE } = SLACK_CONFIG;

module.exports = {
    token: SLACK_BOT_TOKEN,
    eventName: 'slack_message',
    botName: SLACK_BOT_NAME,
    botImage: SLACK_BOT_IMAGE
};
