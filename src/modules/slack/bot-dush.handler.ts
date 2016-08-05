import {Handler} from '../../core/models';
import {SlackMessage} from 'slack-message';

export const botDushHandler = new Handler({
  pattern: /./,
  ambient(message: SlackMessage) {
    if ( message.authorSlack && (message.authorSlack.is_bot || message.authorSlack.real_name === 'slackbot') ) {
      message.addReaction('poop');
    }
  }
});
