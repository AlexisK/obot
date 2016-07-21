const MessageHandlerModel = require('../message-handler.model');
const messageFactoryService = require('../message-factory.service.js');

const greetings = [
    (text, user) => `Ну привет, ${user.fullNname}`,
    () => `Понаехали`,
    () => `Зачем?`,
    (text, user) => `${user.name}, че ты тут забыл?`,
];

const greetingsAdmin = [
    (text, user) => `Да здравствует ваше величество ${user.fullName}!`,
    () => `Ребята - это админ.\nРазберитесь.`
];

module.exports = new MessageHandlerModel(/(^|\W)(прив(е+(т|д))?|йо|з?даров|hell+o|hi|yo+|хай|ал+оха)($|\W)/gi, (text, user, resp) => {
    let greeting;
    if ( user.isSlackAdmin ) {
        greeting = greetingsAdmin[parseInt(Math.random()*greetingsAdmin.length)];
    } else {
        greeting = greetings[parseInt(Math.random()*greetings.length)];
    }
    messageFactoryService.sendTextMessage(resp, greeting(text, user));
});
