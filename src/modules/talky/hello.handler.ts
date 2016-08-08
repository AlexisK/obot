import {Handler, Message} from '../../core/models';

const greetings = [
  message => `Ну привет`,
  message => `Понаехали`,
  message => `Зачем?`,
  message => `Понабирали тут по обьявлению`,
  message => `Ты!, че ты тут забыл?`,
  message => `Ты что себе позволяешь?`
];

const handleMessage = (message : Message) => {
  let greeting = greetings[parseInt(Math.random() * greetings.length)];
  message.reply(greeting(message));
};

export const helloHandler = new Handler({
  pattern: /(^|\W)(прив(е+(т|д))?|йо|з?даров|hell+o|hi|yo+|хай|ал+оха)($|\W)/gi,
  ambient: handleMessage,
  mention(message : Message) {
    handleMessage(message);
    message.replyDirect('Задрал').then((msg : Message) => {
      msg.text = 'Привет';
      setTimeout(() => msg.save(), 5000);
    });

  }
});
