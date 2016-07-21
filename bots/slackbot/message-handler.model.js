const merge = require('lodash/merge');
const isString = require('lodash/isString');

const ORM = require('../../server/orm').service;

/**
 * Represents MessageHandlerModel
 * @constructor
 * @param {string, RegExp} pattern - Pattern to match.
 * @param {function} parser - Parser for the pattern.
 * @param {object} options - Options passed.
 */
module.exports = class MessageHandlerModel {
    constructor(pattern, parser, options) {
        Object.assign(this, {
            pattern,
            parser,
            options: merge({}, options)
        });
    }

   match(pattern) {
       if(isString(this.pattern)) {
           return pattern === this.pattern;
       } else {
           return new RegExp(this.pattern).test(pattern);
       }
   }

   parse(data) {
       if(this.match(data.text)) {
           if (data.user) {
               ORM.fetch('user', {id: data.user}).then(user => {
                   this.parser(data.text, user, data);
               });
           }
       }
   }
};
