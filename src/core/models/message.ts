// Message interface
export class Message {
  public text : string;
  public author : any;
  public mentions : any;
  public botMention : boolean;
  public ts : number;

  constructor(public data : any) {
    Object.assign(this, data);
    this.onData();
  }

  public onData() {
  }

  public replyText(message : any, params? : any) {
  }

  public replyFormattedMessage(message : any, params? : any) {
    this.replyText(JSON.stringify(message, params));
  }

  public reply(req : string|any, params? : any) {
    if (req.constructor === String) {
      return this.replyText(req, params);
    }
    return this.replyFormattedMessage(req, params);
  }

  public replyDirect(req : any, params? : any) {
    return this.reply(req);
  }

  public addReaction(reaction : string) {
  }

  public save() {
  }
}
