const Handler = require('../../models/handler.model');

module.exports = new Handler({
  'pattern' : /(^|\W)(зачем)($|\W)/gi,
  'on_mention, on_direct' : function (message) {
    message.replyText('Надо, Вася, надо!');
  }
});
