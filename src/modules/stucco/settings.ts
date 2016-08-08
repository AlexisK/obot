const { SSH_USER } = require('../../../settings.json');

export const settings = {
  user: SSH_USER,
  agent: process.env.SSH_AUTH_SOCK,
  stringsInBuffer: 10
};
