const forEach = require('lodash/forEach');
const SLACKCONF = require('../../config/slack');
const slackService = require('../../server/services/connections.service').slack;



var MessageFactoryService = {
    /**
     * Send simple message
     * @sendTextMessage
     * @param {object} message - reference to message object (recieved from slackService api)
     * @param {string} text - text to send
     */
    sendTextMessage(message, text) {
        var req = {
            channel: message.channel,
            as_user: false,
            username: SLACKCONF.botName,
            icon_url: SLACKCONF.botImage,
            text
        };

        slackService.reply(message, req);
    },

    /**
     * Send preformatted message
     * @sendFormattedMessage
     * @param {object} message - reference to message object (recieved from slackService api)
     * @param {function} format - format from messageFormats
     * @param {array, any?} data - data to pass into format function. Processes multiple instances if an array is given.
     * @param {string?} text - text to send
     */
    sendFormattedMessage(message, format, data, text) {
        var req = {
            channel: message.channel,
            as_user: false,
            username: SLACKCONF.botName,
            text: text || ' ',
            attachments: []
        };

        if ( data && data.constructor == Array ) {
            forEach(data, dataPiece => {
                req.attachments.push(format(dataPiece));
            });
        } else {
            req.attachments.push(format(data));
        }

        slackService.reply(message, req);
    }

};

module.exports = MessageFactoryService;
