

ORM.declareModel('user', {
    sources: {
        
        
        slack: {
            canFetch : ref => ref.id,
            fetch(ref) {
                return new Promise(done => {
                    slack_bot.api.users.info({user:ref.id}, (err, data) => done(data.user))
                });
            },
            normalize(ref) {
                return {
                    id: ref.id,
                    slack_team_id: ref.team_id,
                    name: ref.name,
                    full_name: ref.real_name,
                    email: ref.profile.email,
                    image: {
                        small: ref.profile.image_48,
                        big: ref.profile.image_512
                    },
                    is_bot: ref.is_bot
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
                    jira_name: ref.name,
                    jira_display_name: ref.displayName,
                    jira_key: ref.key
                }
            }
        }
        
        
    }
});
