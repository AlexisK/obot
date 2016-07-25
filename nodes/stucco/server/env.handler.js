const Handler = require('../../../models/handler.model');
const connectSSH = require('../ssh-connect.util');

const reg = /(?:^|\W)env\s+([^ ]+)\s+([^ ]+)(?:\s+(.+))?$/gi;

const workers = {
  restart: (message, env, command, args) => {
    connectSSH(message, env, command, args,
      `cd /home/hybris_5_7/hybris/bin/platform/ && . ./setantenv.sh && ant clean all`,
      `Server restart ${env}`
    );
  },

  deploy: (message, env, command, args) => {
    let branch = args.split(/\s+/g)[0];
    connectSSH(message, env, command, args,
      `cd /home/hybris_5_7/repos/everything5pounds/ && git fetch --all && git checkout ${branch} && git reset --hard origin/#${branch} && git pull origin #${branch} && cd /home/hybris_5_7/hybris/bin/platform/ && . ./setantenv.sh && ant clean all`,
      `Deploy ${branch}`
    );
  },

  init: (message, env, command, args) => {
    let branch = args.split(/\s+/g)[0];
    connectSSH(message, env, command, args,
      `cd /home/hybris_5_7/repos/everything5pounds/ && git fetch --all && git checkout ${branch} && git reset --hard origin/${branch} && git pull origin ${branch} && cd /home/hybris_5_7/hybris/bin/platform/ && . ./setantenv.sh && /home/hybris_5_7/hybris/bin/platform/hybrisserver.sh stop && ant clean all initialize && /home/hybris_5_6/hybris/bin/platform/hybrisserver.sh start`,
      `Init ${branch}`
    );
  }
};

module.exports = new Handler({
  pattern: reg,
  on_mention: function(message) {
    message.text.replace(new RegExp(reg), (match, env, command, args) => {

      if ( command && workers[command] ) {
        workers[command](message, env, command, args);
      } else {
        message.replyText(`Could not recognise command ${command}.`);
      }

    });
  }
});
