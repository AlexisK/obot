import {Message} from '../../core/models/message';
import {scope} from './connection';
import {settings} from './settings';

export class SlackMessage extends Message {

  private attachments: any[] = [];
  private _interval: any = null;

  replyText(text) {
    scope.rtmClient.sendMessage(text, this.channel);
  }

  _replyFormattedMessageStack() {
    var req = {
      channel    : this.data.channel,
      as_user    : false,
      username   : settings.name,
      icon_url   : settings.image,
      attachments: this.attachments
    };

    scope.webClient.chat.postMessage(this.channel, '', req);
    this.attachments = [];
  }

  replyFormattedMessage(content) {
    this.attachments.push(content);
    clearInterval(this._interval);
    this._interval = setTimeout(this._replyFormattedMessageStack.bind(this), 1);
  }
}
