const { SSH_USER } = require('../../settings.json');

module.export = {
  user: SSH_USER,
  agent: process.env.SSH_AUTH_SOCK
};
