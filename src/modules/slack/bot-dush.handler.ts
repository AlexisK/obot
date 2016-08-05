import {Handler, Message} from '../../core/models';

export const botDushHandler = new Handler({
  pattern: /./,
  ambient(message: Message) {
    if ( message.author.is_bot || message.author.real_name === 'slackbot') {
      message.addReaction('poop');
    }
  }
});
