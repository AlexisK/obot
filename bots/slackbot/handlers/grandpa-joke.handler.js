const MessageHandlerModel = require('../message-handler.model');
const messageFactoryService = require('../message-factory.service.js');

module.exports = new MessageHandlerModel(/дед/, (text, user, resp) => {
    messageFactoryService.sendTextMessage(resp, 'Как говорил мой дед...');
    setTimeout(() =>
        messageFactoryService
            .sendFormattedMessage(resp, require('../message-formats/grandpa-joke.message-format')), 2000);
});
