const merge = require('lodash/merge');
const parseMappedDict = require('../utils/parse-mapped-dict.util');

let messageStack;

module.exports = class Handler {
  constructor(data) {
    messageStack = messageStack || ['on_direct', 'on_mention', 'on_ambient'];
    Handler.mapping = Handler.mapping || {
        on_direct: [],
        on_mention: [],
        on_ambient: []
      };

    Object.assign(this, merge({
      pattern: ''
    }, parseMappedDict(data)));

    messageStack.forEach(type => {
      if (this[type]) {
        Handler.mapping[type].push(this);
      }
    });
  }

  match(content) {
    return new RegExp(this.pattern).test(content);
  }

  parse(message, type) {
    if (this.match(message.text)) {
      this[type](message);
    }
  }
};
