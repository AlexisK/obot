const MessageHandlerModel = require('../message-handler.model');
const messageFactoryService = require('../message-factory.service.js');
const gitlab = require('../../../server/services/connections.service').gitlab;

module.exports = new MessageHandlerModel(/gitlab users list/, (text, user, resp) =>
    gitlab
        .users
        .all((users) =>
            messageFactoryService
                .sendFormattedMessage(
                    resp,
                    require('../message-formats/gitlab.message-format'),
                    users,
                    `Here is the list of all Stucco Gitlab users requested by ${user.fullName}`)
        )
);
