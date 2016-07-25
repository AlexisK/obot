const Handler = require('../../../models/handler.model');

const reg = /(?:^|\W)env\s+([^ ]+)\s+([^ ]+)(?:\s+(.+))?$/gi;

module.exports = new Handler({
  pattern: reg,
  on_mention: function(message) {
    message.text.replace(new RegExp(reg), (match, env, command, args) => {
      message.replyText(`${env}->${command}->${args}`);
    });
  }
});
