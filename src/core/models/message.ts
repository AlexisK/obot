
export class Message {
  constructor(public data: any) {
    Object.assign(this, data);
    this.onData();
  }
  public onData() {}
  public reply() {}
  public replyText(message: any) {}
  public replyFormattedMessage(message: any) {
    this.replyText(JSON.stringify(message));
  }
}
