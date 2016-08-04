import {Handler, Message} from '../../core/models';

export const whyHandler = new Handler({
  pattern: /(^|\W)(зачем)($|\W)/gi,
  mention(message) {
    message.reply('Надо, Вася, надо!');
  }
});
