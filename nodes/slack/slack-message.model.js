const Message = require('../../models/message.model');
const {name, image} = require('./slack.config');

module.exports = class SlackMessage extends Message {
  on_data() {
    this.text        = this.data.text;
    this.bot         = require('./slack.connection');
    this.attachments = [];
    this._int = null;
  }

  replyText(text) {
    var req = {
      channel  : this.data.channel,
      as_user  : false,
      username : name,
      icon_url : image,
      text
    };

    this.bot.reply(this.data, req);
  }

  _replyFormattedMessageStack() {
    var req = {
      channel     : this.data.channel,
      as_user     : false,
      username    : name,
      icon_url    : image,
      attachments : this.attachments
    };
    this.bot.reply(this.data, req);
    this.attachments = [];
  }

  replyFormattedMessage(content) {
    this.attachments.push(content);
    clearInterval(this._int);
    this._int = setTimeout(this._replyFormattedMessageStack.bind(this), 1);
  }
};
