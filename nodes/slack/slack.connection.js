const Handler      = require('../../models/handler.model');
const Connection   = require('../../models/connection.model');
const SlackMessage = require('./slack-message.model');
const SlackBot     = require('botkit').slackbot;
const {token}     = require('./slack.config');

const connection = new Connection('slack', () => {
  const instance = SlackBot({debug : false});
  const bot      = instance.spawn({
    token
  }).startRTM();

  instance.hears('', ['direct_message'], (bot, message) =>
    Handler.mapping.on_direct.forEach(handler => {
      handler.parse(new SlackMessage(message), 'on_direct');
    })
  );

  instance.hears('', ['direct_mention', 'mention'], (bot, message) =>
    Handler.mapping.on_mention.forEach(handler => {
      handler.parse(new SlackMessage(message), 'on_mention');
    })
  );

  instance.hears('', ['ambient'], (bot, message) =>
    Handler.mapping.on_ambient.forEach(handler => {
      handler.parse(new SlackMessage(message), 'on_ambient');
    })
  );

  return bot;
}).connect();

module.exports = connection;
