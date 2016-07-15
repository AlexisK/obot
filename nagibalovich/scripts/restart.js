var SSH = require("simple-ssh");

module.exports = function(robot) {
    robot.respond(/env (.+?) testrestart/i, function(msg) {

        var
            user = "centos",
            host = msg.match[1],
            command = "cd /home/hybris_5_6/hybris/bin/platform/ && . ./setantenv.sh && ant clean all",
            ssh = new SSH({
                user: user,
                host: host,
                agent: process.env.SSH_AUTH_SOCK,
                agentForward: true

            });

        ssh.on('error', function(err) {
            msg.reply(err);
            ssh.end();
        });

        ssh.exec(command, {
            exit: function(code) {
                msg.reply('Server restart\n' + host);
            }
        }).start();
    });
};


