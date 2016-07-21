const Hapi = require('hapi');

const emitter = require('./server/services/event-emitter');
const slackHandler = require('./bots/slackbot').handler;
const SLACK_CONFIG = require('./config/slack');

// Connect APIs
require('./server/services/connections.service');

const server = new Hapi.Server();
server.connection({ port: 3000 });

server.start((err) => {
    if (err) { throw err; }
    console.log('Server running at:', server.info.uri);

    // Subscribe bot to slackService
    emitter.on(SLACK_CONFIG.eventName, (bot, message) => {
        slackHandler(message);
    });
});
