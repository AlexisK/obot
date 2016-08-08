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

  let lock = false;
  let req = new SSH(<any>params);

  // stringBuffer to display last 10 strings of response
  let stringBuffer = new Array(settings.stringsInBuffer).fill('>');

  message.replyDirect(`\`\`\`${stringBuffer.join('\n')}\`\`\``).then(statusMessage => {
    req.on('error', err => {
      console.error(`ssh env ${env} failed to ${command} with args ${args}`, err);
      message.replyText(`ssh env ${env} failed to ${command} ${args}`);
      req.end();
    });
    req.exec(execString, {
      exit : code => {
        console.log('SSH: exit\n', code);
        statusMessage.text = <string>okMessage;
        statusMessage.save();
      },
      err  : stdout => {
        console.error('SSH: err\n', stdout);
        //message.reply(stdout);
      },
      out  : stdout => {
        let strings = stdout.split('\n');

        if ( strings.length >= settings.stringsInBuffer ) {
          stringBuffer = strings.slice(strings.length-settings.stringsInBuffer);
        } else {
          stringBuffer = stringBuffer.slice(strings.length).concat(strings);
        }

        if ( !lock ) {
          lock = true;
          statusMessage.text = <string>`\`\`\`${stringBuffer.join('\n')}\`\`\``;
          statusMessage.save().then(()=>{
            setTimeout(()=>{lock=false;}, 100);
          });
        }
        //console.error('SSH: out');
        //message.reply(stdout);
      }
    });

    try {
      req.start();
    } catch (err) {
      console.error('SSH: failed to start\n', params, '\n', err);
      message.replyText(err.toString());
    }
  });

};
