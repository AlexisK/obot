const MessageHandlerModel = require('../message-handler.model');
const messageFactoryService = require('../message-factory.service.js');

module.exports = new MessageHandlerModel(/.+/, (text, user, resp) => {
    if ( user.isBot ) {
        messageFactoryService.sendTextMessage(resp, `Я нашел бота! Его зовут ${user.name}!`);
    }
});
