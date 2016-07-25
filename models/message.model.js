module.exports = class Message {
  constructor(data) {
    this.data = data;
    this.on_data();
  }

  on_data() {}
  replyText(message) {}
  replyFormattedMessage(message) { this.replyText(message); }

};
