import {Handler, Message} from '../../core/models';
import { grandpaFormatter } from './grandpa.formatter';

export const grandpaHandler = new Handler({
  pattern: /(^|\W)(дед)($|\W)/gi,
  'mention, direct'(message : Message) {
    message.reply('Как говорил мой дед...');
    setTimeout(() => message.replyFormattedMessage(grandpaFormatter.format('Я твой дед')), 2000);
  }
});
