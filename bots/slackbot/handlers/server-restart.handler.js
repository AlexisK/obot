const MessageHandlerModel = require('../message-handler.model');
const messageFactoryService = require('../message-factory.service.js');
const SSH = require("simple-ssh");


module.exports = new MessageHandlerModel(/\s*env\s+(.+?)\s+testrestart\s*/gi, (text, ruser, resp) => {
    var user = "centos",
        host = msg.match[1],
        command = "cd /home/hybris_5_6/hybris/bin/platform/ && . ./setantenv.sh && ant clean all";

    (/\s*env\s+(.+?)\s+testrestart\s*/gi).replace((m, env) => { host = env; }, '');

    var ssh = new SSH({
        user,
        host,
        agent: process.env.SSH_AUTH_SOCK,
        agentForward: true
    });
    ssh.on('error', function(err) {
        messageFactoryService.sendTextMessage(resp, err);
        ssh.end();
    });
    ssh.exec(command, {
        exit: function(code) {
            messageFactoryService.sendTextMessage(resp, `Server restart\n${host}`);
        }
    }).start();
});
