module.exports = class Message {
  constructor(data) {
    this.data = data;
    this.onData();
  }

  onData() {}
  replyText(message) {}
  replyFormattedMessage(message) { this.replyText(message); }

};
