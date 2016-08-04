import {parseMappedDict} from '../utils/parse-mapped-dict';

export class Handler {
  static events : string[] = ['direct', 'mention', 'ambient'];
  static map               = {
    direct : [],
    mention: [],
    ambient: []
  };
  public pattern : string | RegExp;

  constructor(data) {
    Object.assign(this, {pattern: ''}, parseMappedDict(data));

    Handler.events.forEach((type : string) => {
      if (this[type]) {
        Handler.map[type].push(this);
      }
    });
  }

  private _match(content : string) : boolean {
    return new RegExp(<string>this.pattern).test(content);
  }

  public parse(message : any, type : string) {
    if (this._match(message.text)) {
      this[type](message);
    }
  }
}
