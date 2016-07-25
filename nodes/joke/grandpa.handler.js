const Handler = require('../../models/handler.model');

module.exports = new Handler({
  pattern: /дед/,
  'on_direct, on_mention': function(message) {
    message.replyText('Как говорил мой дед...');
    setTimeout(() => message.replyFormattedMessage(require('./grandpa.formatter').format('Я твой дед')), 2000);
  }
});
