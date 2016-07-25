const Message = require('../../models/message.model');
const { name, image } = require('./slack.config');

module.exports = class SlackMessage extends Message {
  onData() {
    this.text = this.data.text;
    this.bot = require('./slack.connection');
    this.attachments = [];
    this._interval = null;
  }

  replyText(text) {
    var req = {
      channel: this.data.channel,
      as_user: false,
      username: name,
      icon_url: image,
      text
    };

    this.bot.reply(this.data, req);
  }

  _replyFormattedMessageStack() {
    var req = {
      channel: this.data.channel,
      as_user: false,
      username: name,
      icon_url: image,
      attachments: this.attachments
    };
    this.bot.reply(this.data, req);
    this.attachments = [];
  }

  replyFormattedMessage(content) {
    this.attachments.push(content);
    clearInterval(this._interval);
    this._interval = setTimeout(this._replyFormattedMessageStack.bind(this), 1);
  }
};
