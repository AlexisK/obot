const Handler = require('../../models/handler.model');

const greetings = [
  message => `Ну привет`,
  message => `Понаехали`,
  message => `Зачем?`,
  message => `Понабирали тут по обьявлению`,
  message => `Ты!, че ты тут забыл?`
];

module.exports = new Handler({
  'pattern' : /(^|\W)(прив(е+(т|д))?|йо|з?даров|hell+o|hi|yo+|хай|ал+оха)($|\W)/gi,
  'on_direct, on_mention, on_ambient' : function (message) {
    let greeting = greetings[parseInt(Math.random() * greetings.length)];
    message.replyText(greeting(message, {}));
  }
});
