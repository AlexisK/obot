const MessageHandlerModel = require('../message-handler.model');
const messageFactoryService = require('../message-factory.service.js');

module.exports = new MessageHandlerModel(/(^|\W)(зачем)($|\W)/gi, (text, user, resp) => {
    messageFactoryService.sendTextMessage(resp, 'Затем!');
});
