// Message interface
export class Message {
  constructor(public data: any) {
    Object.assign(this, data);
    this.onData();
  }
  public onData() {}
  public replyText(message: any, params?: any) {}
  public replyFormattedMessage(message: any, params?: any) {
    this.replyText(JSON.stringify(message, params));
  }

  public reply(req: string|any, params?: any) {
    if ( req.constructor === String ) {
      return this.replyText(req, params);
    }
    return this.replyFormattedMessage(req, params);
  }

  public replyDirect(req: any, params?: any) {
    return this.reply(req);
  }

  public save() {}
}
