var SSH = require("simple-ssh");
const { user, agent } = require('./ssh.config');

module.exports = function connectSSH(message, env, command, args, execString, okMessage) {
  var req = new SSH({
    user,
    host: env,
    agent,
    agentForward: true
  });
  req.on('error', err => {
    console.error(`ssh env ${env} failed to ${command} with args ${args}`, err);
    message.replyText(`ssh env ${env} failed to ${command}`);
    req.end();
  });
  req.exec(execString, {
    exit: code => {
      console.log(code);
      message.replyText(okMessage);
    },
    err: stdout => {
      console.error(stdout);
      message.replyText(stdout);
    },
    out: stdout => {
      console.error(stdout);
      message.replyText(stdout);
    }
  });

  try {
    req.start();
  } catch(err) {
    console.error(err);
    message.replyText(err.toString());
  }
};

