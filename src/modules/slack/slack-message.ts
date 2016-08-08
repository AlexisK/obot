const merge = require('lodash/merge');
import {Message} from '../../core/models/message';
import {scope} from './connection';
import {settings} from './settings';


export class SlackMessage extends Message {

  private attachments : any[] = [];
  private _promises : any[]   = [];
  private _interval : any     = null;

  // there are other fields, but they inherit from Message
  public channel : string;
  public authorChannel : string;
  public authorSlack: any;

  static _getReq(params? : any, data? : any) {
    return merge({
      as_user  : false,
      username : params.name || settings.name,
      icon_url : params.image || settings.image,
    }, data);
  }

  replyText(text : string, params? : any = {}) {
    return new Promise((resolve, reject) => {
      var req = SlackMessage._getReq(params);
      scope.webClient.chat.postMessage(params.channel || this.channel, text, req, (err, msg) => resolve(new SlackMessage(msg)));
    });

  }

  _replyFormattedMessageStack(params) {
    var req = SlackMessage._getReq(params, {attachments : this.attachments});

    scope.webClient.chat.postMessage(params.channel || this.channel, '', req, (err, msg) => {
      this._promises.forEach(resolver => resolver(new SlackMessage(msg)));
      this._promises = [];
    });
    this.attachments = [];
  }

  replyFormattedMessage(content : any, params? : any = {}) {
    this.attachments.push(content);
    clearInterval(this._interval);
    this._interval = setTimeout(() => this._replyFormattedMessageStack(params), 1);
    return new Promise((resolve, reject) => {
      this._promises.push(resolve);
    });

  }

  replyDirect(req : any) {
    return this.reply(req, {
      channel : this.authorChannel
    });
  }

  addReaction(reaction : string) {
    return new Promise((resolve, reject) => {
      scope.webClient.reactions.add(reaction, {
        channel: this.channel,
        timestamp: this.ts
      }, resolve);
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      scope.rtmClient.updateMessage(this, ()=>resolve(this));
    });

  }
}
