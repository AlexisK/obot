var SSH = require("simple-ssh");
const { user, agent } = require('./ssh.config');

module.exports = function connectSSH(message, env, command, args, execString, okMessage) {
  let params = {
    user,
    host: env,
    agent,
    agentForward: false
  };
  let req = new SSH(params);
  req.on('error', err => {
    console.error(`ssh env ${env} failed to ${command} with args ${args}`, err);
    message.replyText(`ssh env ${env} failed to ${command} ${args}`);
    req.end();
  });
  req.exec(execString, {
    exit: code => {
      console.log('SSH: exit\n',code);
      message.replyText(okMessage);
    },
    err: stdout => {
      console.error('SSH: err\n',stdout);
      //message.replyText(stdout);
    },
    out: stdout => {
      //console.error('SSH: out');
      //message.replyText(stdout);
    }
  });

  try {
    req.start();
  } catch(err) {
    console.error('SSH: failed to start\n',params,'\n', err);
    message.replyText(err.toString());
  }
};

