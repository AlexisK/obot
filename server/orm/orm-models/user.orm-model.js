const ORM = require('../orm.service');
const slack = require('../../services/connections.service').slack;
const jira = require('../../services/connections.service').jira;

module.exports = ORM.declareModel('user', {
    sources: {
        slack: {
            canFetch : ref => ref.id,
            fetch(ref) {
                return new Promise(done => {
                    slack.api.users.info({user:ref.id}, (err, data) => done(data.user))
                });
            },
            normalize(ref) {
                return {
                    id: ref.id,
                    slackTeamID: ref.team_id,
                    name: ref.name,
                    fullName: ref.real_name,
                    email: ref.profile.email,
                    phone: ref.profile.phone,
                    skype: ref.profile.skype,
                    image: {
                        small: ref.profile.image_48,
                        big: ref.profile.image_512
                    },
                    isBot: ref.is_bot,
                    isSlackAdmin: ref.is_admin
                }
            }
        },

        jira: {
            canFetch: ref => ref.email,
            fetch(ref) {
                return new Promise(done => {
                    jira.searchUsers(ref.email, 0, 1, true, true, (err, list) => done(list[0]));
                });
            },
            normalize(ref) {
                return {
                    jiraName: ref.name,
                    jiraDisplayName: ref.displayName,
                    jiraKey: ref.key
                }
            }
        }
    }
});
