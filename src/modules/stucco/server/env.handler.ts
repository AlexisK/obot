import {Handler, Message} from '../../../core/models';
import {auth} from '../../../server/auth';

import {executeSSH} from '../ssh-execute.util';

const reg = /(?:^|\W)env\s+([^ ]+)\s+([^ ]+)(?:\s+(.+))?$/gi;

const workers = {
  restart : (message : Message, env : string, command : string, args : string) => {
    auth.checkUserAuth(message.author, ['envRestart']).then(()=>{
      executeSSH(message, env, command, args,
        `cd /home/hybris_5_7/hybris/bin/platform/ && . ./setantenv.sh && ant clean all`,
        `Server restart ${env}`
      );
    }).catch(()=>{
      message.addReaction('lock');
    });
  },

  deploy : (message : Message, env : string, command : string, args : string) => {
    auth.checkUserAuth(message.author, ['envDeploy']).then(()=>{
      let branch = args.split(/\s+/g)[0];
      executeSSH(message, env, command, args,
        `cd /home/hybris_5_7/repos/everything5pounds/ && git fetch --all && git checkout ${branch} && git reset --hard origin/${branch} && git pull origin ${branch} && cd /home/hybris_5_7/hybris/bin/platform/ && . ./setantenv.sh && ant clean all`,
        `Deploy ${branch}`
      );
    }).catch(()=>{
      message.addReaction('lock');
    });

  },

  init : (message : Message, env : string, command : string, args : string) => {
    auth.checkUserAuth(message.author, ['envInit']).then(()=>{
      let branch = args.split(/\s+/g)[0];
      executeSSH(message, env, command, args,
        `cd /home/hybris_5_7/repos/everything5pounds/ && git fetch --all && git checkout ${branch} && git reset --hard origin/${branch} && git pull origin ${branch} && cd /home/hybris_5_7/hybris/bin/platform/ && . ./setantenv.sh && /home/hybris_5_7/hybris/bin/platform/hybrisserver.sh stop && ant clean all initialize && /home/hybris_5_6/hybris/bin/platform/hybrisserver.sh start`,
        `Init ${branch}`
      );
    }).catch(()=>{
      message.addReaction('lock');
    });

  }
};

export const envHandler = new Handler({
  pattern : reg,
  mention(message : Message) {
    for (let match : any, regex : RegExp = (new RegExp(reg)); match = regex.exec(message.text);) {
      let [, env, command, args] = match;

      if (command && workers[command]) {
        workers[command](message, env, command, args);
      } else {
        message.replyText(`Could not recognise command ${command}.`);
      }
    }
  }
});
