var SSH = require("simple-ssh");

import {Message} from '../../core/models/message';
import {settings} from './settings';


export const executeSSH = function executeSSH(message : Message,
                                              env : string,
                                              command : string,
                                              args : string,
                                              execString : string,
                                              okMessage : string) {
  let params = {
    user         : settings.user,
    host         : env,
    agent        : settings.agent,
    agentForward : false
  };

  let req = new SSH(<any>params);

  req.on('error', err => {
    console.error(`ssh env ${env} failed to ${command} with args ${args}`, err);
    message.replyText(`ssh env ${env} failed to ${command} ${args}`);
    req.end();
  });
  req.exec(execString, {
    exit : code => {
      console.log('SSH: exit\n', code);
      message.replyText(okMessage);
    },
    err  : stdout => {
      console.error('SSH: err\n', stdout);
      //message.replyText(stdout);
    },
    out  : stdout => {
      //console.error('SSH: out');
      //message.replyText(stdout);
    }
  });

  try {
    req.start();
  } catch (err) {
    console.error('SSH: failed to start\n', params, '\n', err);
    message.replyText(err.toString());
  }
};
