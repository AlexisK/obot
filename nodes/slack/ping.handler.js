const Handler = require('../../models/handler.model');

module.exports = new Handler({
  'pattern'              : 'ping',
  'on_direct,on_mention' : function (message) {
    message.replyFormattedMessage(require('./pong.formatter').format('pong'));
  },
  'on_ambient': function(message) {
    message.replyText('no pong for you today!');
  }
});
