const forOwn = require('lodash/forOwn');

var MessageFormatService = {
    /**
     * Reads params from string
     * @readParamsFromString
     * @param {string} str - Source string to parse commands from
     * {string} *args - Any number of keys for parsing (see example)
     *
     * input:
     *  readParamsFromString('command test this string', 'alpha', 'beta')
     * output:
     *  { alpha: 'command', beta: 'test', args: ['this', 'string'] }
     */
    readParamsFromString(str) {
        var base = Array.prototype.splice.call(arguments, 0, 1)[0].trim().split(/[\s,]+/g);
        var result = { args: [] };
        for ( var i = 0, len = Math.min(arguments.length, base.length); i < len; i++ ) {
            if ( typeof(arguments[i]) != 'undefined' && arguments[i] != null ) {
                result[arguments[i]] = base[i]
            }
        }
        if ( base.length > arguments.length ) {
            result.args = base.slice(arguments.length);
        }
        return result;
    },

    /**
     * Returns default unassigned user if passed argument is null/undefined
     * @formatJiraUser
     * @param {object} user
     * @returns {object}
     */
    formatJiraUser(user) {
        if ( !user ) {
            return {
                displayName: 'Unassigned'
            }
        }
        return user;
    },

    /**
     * Format for slackService field format https://api.slack.com/docs/message-attachments.
     * @createSlackFields
     * @param {object} rules
     * @returns {Array}
     */
    createSlackFields(rules) {
        var fieldList = [];
        forOwn(rules, (value, key) => {
            fieldList.push({
                title: key,
                value: value,
                short: true
            });
        });
        return fieldList;
    }
};

module.exports = MessageFormatService;
