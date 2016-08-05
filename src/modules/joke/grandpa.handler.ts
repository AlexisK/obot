import {Handler, Message} from '../../core/models';
import {grandpaFormatter} from './grandpa.formatter';
import {auth} from '../../server/auth';

export const grandpaHandler = new Handler({
  pattern : /(^|\W)(дед)($|\W)/gi,
  'mention, direct'(message : Message) {
    auth.checkUserAuth(message.author, ['general']).then(() => {
      message.reply('Как говорил мой дед...');
      setTimeout(() => message.replyFormattedMessage(grandpaFormatter.format('Я твой дед')), 2000);
    }).catch(() => {
      message.addReaction('lock');
    });
  }
});
