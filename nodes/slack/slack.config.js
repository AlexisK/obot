const {SLACK_BOT_TOKEN, SLACK_BOT_NAME, SLACK_BOT_IMAGE} = require('../../settings.json');

module.exports = {
  token : SLACK_BOT_TOKEN,
  name  : SLACK_BOT_NAME,
  image : SLACK_BOT_IMAGE
};
