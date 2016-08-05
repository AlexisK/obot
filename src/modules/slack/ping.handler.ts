import {Handler} from '../../core/models/handler';

export const pingHandler = new Handler({
  'pattern': 'ping',

  'direct, mention': function (message) {
    message.replyFormattedMessage(require('./ping.formatter').format('pong'));
    message.replyDirect('pong!');
  },

  'ambient': function (message) {
    message.replyText(`no pong for you today, ${message.author.fullName}!`);
  }
});
