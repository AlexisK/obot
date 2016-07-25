const merge           = require('lodash/merge');
const parseMappedDict = require('../utils/parse-mapped-dict.util');

class Handler {
  constructor(data) {
    Object.assign(this, merge({
      'pattern' : ''
    }, parseMappedDict(data)));

    if ( this.on_direct ) {
      Handler.mapping.on_direct.push(this);
    }
    if ( this.on_mention ) {
      Handler.mapping.on_mention.push(this);
    }
    if ( this.on_ambient ) {
      Handler.mapping.on_ambient.push(this);
    }
  }

  match(content) {
    return new RegExp(this.pattern).test(content);
  }

  parse(message, type) {
    if(this.match(message.text)) {
      this[type](message);
    }
  }
}

Handler.mapping = {
  on_direct  : [],
  on_mention : [],
  on_ambient : []
};

module.exports = Handler;
