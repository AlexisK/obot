const { SSH_USER } = require('../../settings.json');

module.exports = {
  user: SSH_USER,
  agent: process.env.SSH_AUTH_SOCK
};
