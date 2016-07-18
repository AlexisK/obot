
global.config = {
    locale: "en-US",
    slack: {
        token: "xoxb-60641844672-Qaydhgxuu9yNyahx99KrWe9c"
    },
    version: {
        db: 2
    },
    reconnect_timeout: 5000,
    jira: {
        protocol: 'https://',
        host: 'camdenmarket.atlassian.net',
        port: '443',
        user: 'alexey.kaliuzhnyy',
        password: 'joa798ASF9',
        status: (function(obj) {
            obj.available = [obj.pending, obj.current].join(', ')
            obj.all = [obj.pending, obj.current, obj.done].join(', ')
            return obj;
        })({
            current: '"In Progress"',
            pending: '"New"',
            done: '"Done"'
        }),
        path: {
            task: 'browse/'
        }
    }
}
