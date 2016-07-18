
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


function def(val) { return typeof(val) != 'undefined' && val !== null; }

function S(query, target) {
    if (query[0] == '#') { return document.getElementById(query.slice(1)); }
    target = target || document;
    if ( query[0] == '.' ) { return target.getElementsByClassName(query.slice(1)); }
    return target.getElementsByTagName(query);
}

function cr(tag, cls, parent) {
    var elem = document.createElement(tag);
    if ( def(cls) ) { elem.className = cls; }
    if ( def(parent) ) { parent.appendChild(elem); }
    return elem;
}

function loadJson(path, todo) {
    var newNode = cr('script');// loading json with 'script' tag in order to work directly from fs
    newNode.onload = todo;
    newNode.src = path;
    document.body.appendChild(newNode);
}

function mergeObjects() {
    if ( !arguments.length ) { return {}; }
    arguments[0] = arguments[0] || {};
    return Array.prototype.reduce.call(arguments, (base, obj)=> {
        for ( var k in obj ) {
            base[k] = obj[k];
        }
        return base;
    });
}

function $P(obj, key, getter, setter) {
    if ( Object.__defineGetter__ ) {
        if ( def(getter) ) { obj.__defineGetter__(key, getter); }
        if ( def(setter) ) { obj.__defineSetter__(key, setter); }
    } else {
        var DO = {
            enumerable: true,
            configurable: true
        }
        
        if ( def(getter) ) { DO['get'] = getter; }
        if ( def(setter) ) { DO['set'] = setter; }
        
        Object.defineProperty(obj, key, DO);
    }
}

function tm(todo,tmr) {
    tmr = tmr || 1;
    return setTimeout(todo,tmr);
}


function PF(todo) {
    var cache;
    return () => { return cache || (cache = new Promise(todo)); };
}


var MODEL = {};

function inherit(ref, args) {
    if ( !this._inherits || this._inherits.indexOf(ref) != -1 ) { return 0; }
    ref.apply(this, args);
    this._inherits.push(ref);
    
}

function newModel(name, fabric) {
    MODEL[name] = {
        declare: [],
        fabric: fabric
    };
    if ( fabric ) {
        global[name] = fabric;
        global[name.toUpperCase()] = {};
    }
}

function getSelf(ref, key) {
    ref._inherits = ref._inherits||[];
    
    ref.inherit = inherit;
    
    if ( key && MODEL[key] ) {
        MODEL[key].lastInstance = ref;
    }
    
    return ref;
}


newModel('BaseModel', function() {
    var self = getSelf(this);
    
    self.init = function() {
        
    }
    
    self.init();
});









newModel('MessageHandler', function(pattern, parser, options) {
    var self = getSelf(this, 'GlobalEvent');
    self.inherit(BaseModel);
    
    self.init = () => {
        
        self.pattern = pattern;
        self.parser = parser;
        self.options = mergeObjects({
            
        }, options);
        
        if ( self.pattern.constructor == 'String' ) {
            self.is_match = function(val) { return val == self.pattern; }
        } else {
            self.is_match = function(val) { return (new RegExp(self.pattern)).test(val); }
        }
        
        MESSAGEHANDLER[pattern] = self;
    }
    
    self.handle = function(resp) {
        if ( self.is_match(resp.text) ) {
            self.parser(self, resp.text, ORM.db.user[resp.user], resp);
        }
    }
    
    self.init();
    
});

var W3CWebSocket = require('websocket').w3cwebsocket;

newModel('WebSocketClient', function(name, options) {
    
    var self = getSelf(this);
    self.inherit(BaseModel);
    
    self.init = function() {
        self.name = name;
        
        self.options = mergeObjects({
            path: null,
            write: (self, data) => { self.socket.send(data); return new Promise(done => done()); },
            read : (self, data, ev) => { return new Promise(done => done(data)); },
            open : (self) => { return new Promise(done => done()); },
            close: (self) => { return new Promise(done => {
                tm(self.reconnect, config.reconnect_timeout);
            }) },
            error: (self) => { return new Promise(done => done()); }
        }, options);
        
        WEBSOCKETCLIENT[name] = self;
        
        //-self.reconnect();
    }
    
    self.read  = function() { Array.prototype.splice.call(arguments, 0, 0, self); return self.options.read.apply(self, arguments); }
    self.write = function() { Array.prototype.splice.call(arguments, 0, 0, self); return self.options.write.apply(self, arguments); }
    
    self.reconnect = function(path) {
        if ( def(path) ) { self.options.path = path; }
        
        var socket = new W3CWebSocket(self.options.path);
        console.log('WebSocket Client Created ', self.options.path);
        socket.onerror = ev => console.log('Error! ',ev);
        socket.onclose = ev => console.log('Close! ',ev);
        socket.onopen = ev => {
            console.log('WebSocket Client Connected');
            self.options.open(self, ev).then(() => {
                console.log('WebSocket Client options loaded');
                socket.onclose = ev => { console.error('Socket closed'); return self.options.close(self, ev); }
                socket.onerror = ev => { console.error('Socket caught error!'); return self.options.error(self, ev); }
                socket.onmessage = ev => { return self.options.read(self, ev.data, ev); }
            });
        }
        
        self.socket = socket;
    }
    
    self.init();
    
});

function $AD(obj, path, params) {
    params = params || {};
    
    if ( !def(obj) ) { return null; }
    if ( typeof(path) == 'string' ) { path = path.split('.'); }
    
    if ( path.length > 0 ) {
        
        if ( !def(obj[path[0]]) && def(params.autocreate) ) {
            obj[path[0]] = CO(params.autocreate);
        }
        if ( !def(obj[path[0]]) ) {
            if ( def(params.autocreate) ) {
                obj[path[0]] = CO(params.autocreate);
            } else if ( def(params.onnull) ) {
                obj[path[0]] = params.onnull(obj, path[0], path);
            }
        }
        
        if ( path.length == 1 ) {
            if ( params.del ) {
                var o = obj[path[0]];
                delete obj[path[0]];
                return o;
            } else if ( def(params.setVal) ) {
                obj[path[0]] = params.setVal;
            }
        }
        
        
        return $AD(obj[path.splice(0,1)[0]], path, params);
    }
    
    return obj;
}

var FormData = require('form-data');
var XMLHttpRequest = require('xhr2');

function ajaxRequest(method, path, data, todo) {
    if ( typeof(data) == 'function' ) {
        todo = data;
        data = {};
    }
	data = data || {};
	todo = todo || function(data) {
		console.log(data);
	}
	
	var r = new XMLHttpRequest();
	r.onreadystatechange = (ev) => {
		if ( r.readyState == 4 ) {
			var reqData;
			try {
				reqData = JSON.parse(r.responseText);
			} catch(err) {
				reqData = r.responseText;
			}
			todo(reqData, r, ev);
		}
	}
	
// 	console.log(method, path, data);
	if ( Object.keys(data).length == 0 ) {
	    if ( method == 'AUTO' ) { method = 'GET'; }
	    r.open(method, path);
	    r.send();
	} else {
	    if ( method == 'AUTO' ) { method = 'POST'; }
	    r.open(method, path);
	    var formData = new FormData();
	    for ( var k in data ) {
	        formData.append(k, data[k]);
	    }
	    r.send(formData);
	}
	
	
}



global.EMITON = {
    listeners: {}
}

function EMIT() {
    var keys = Array.prototype.splice.call(arguments,0,1)[0];
    if ( typeof(keys) == 'string' ) { keys = keys.split('/'); }
    
    for ( ; keys.length; keys.pop() ) {
        var key = keys.join('/');
        if ( EMITON.listeners[key] ) {
            EMITON.listeners[key].forEach(todo=>todo.apply(todo,arguments));
        }
    }
}

function ON(key, todo) {
    if ( typeof(key) != 'string' ) {
        key = key.join('/');
    }
    EMITON.listeners[key] = EMITON.listeners[key] || [];
    EMITON.listeners[key].push(todo);
    
}


global.ORM = new (function() {
    var self = this;
    
    self.init = function() {
        self.model = {};
        self.db = {};
    }
    
    self.declareModel = function(model, params) {
        params = params || {};
        self.model[model] = {
            name: model,
            sources: {}
        }
        self.db[model] = {};
        
        if ( params.sources ) {
            for ( var k in params.sources ) {
                self.declareModelSource(model, k, params.sources[k]);
            }
        }
    }
    
    self.declareModelSource = function(model, name, params) {
        self.model[model].sources[name] = mergeObjects({
            name: name,
            canFetch: ref => true,
            fetch: ref => new Promise(done => done()),
            normalize: ref => { return {}; }
        }, params);
    }
    
    self._getObjectFetchables = function(params, obj) {
        var fetchables = [];
        for ( var k in params.sources ) {
            var source = params.sources[k];
            
            if ( obj.fetch[source.name] != true && source.canFetch(obj) ) {
                obj.fetch[source.name] = true;
                fetchables.push(self._getObjectFetchablesWorker(source, obj));
            }
        }
        return fetchables;
    }
    
    self._getObjectFetchablesWorker = function(source, obj) {
        return new Promise(done => {
            source.fetch(obj)
            .then(newObj => {
                mergeObjects(obj, source.normalize(newObj));
                done();
            })
            .catch(() => { console.error('Failed to fetch!'); done(); })
            
        })
    }
    
    self._worker = function(params, obj, todo) {
        var fetchables = self._getObjectFetchables(params, obj);
        
        if ( fetchables.length == 0 ) { todo(); return 0; }
        
        Promise.all(fetchables).then(()=> {
            self._worker(params, obj, todo);
        });
        
    }
    
    self.fetch = function(model, obj) {
        if ( !obj ) { return Promise.reject(); }
        obj = self.syncObj(model, obj);
        
        
        return obj._fetchPromise || (obj._fetchPromise = new Promise((alldone, allfail) => {
            var promises = [];
            var params = self.model[model];
            self._worker(params, obj, alldone);
        }));
        
    }
    
    self.syncObj = function(model, obj) {
        
        if ( obj.id ) {
            if ( !self.db[model][obj.id] ) {
                self.db[model][obj.id] = obj;
                obj.fetch = obj.fetch || {};
            }
            return self.db[model][obj.id];
        }
        return obj;
    }
    
    self.init()
})();

var jiraApi = require('jira').JiraApi;
var SlackBot = require('botkit').slackbot;


function connect_jira() {
    var jira = new jiraApi('https', config.jira.host, config.jira.port, config.jira.user, config.jira.password, '2');
    global.jira = jira;
    console.log('Connected Jira');
}



function connect_slack() {
    var slack = SlackBot({debug: false});
    var bot = slack.spawn({
        token: config.slack.token
    }).startRTM();
    
    slack.hears('hello',['direct_message','direct_mention','mention','ambient'],function(bot,message) {
        bot.reply(message,'Hello yourself.');
    });
    
    slack.hears('^.*$',['direct_message','direct_mention','mention','ambient'],function(bot,message) {
        
        EMIT('slack/read/message', bot, message);
    });
    
    slack.on('message_received', function(bot, message) {
        
    });
    
    global.slack = slack;
    global.slack_bot = bot;
    
    console.log('Connected Slack');
}



function escape(val) {
    return val.replace('&', '&amp;')
              .replace('<', '&lt;')
              .replace('>', '&gt;');
}

function sendAsBot(resp, msg, botname) {
    var req = {
        channel: resp.channel,
        as_user: false,
        username: botname||'R2Dot',
        icon_url: 'http://lorempixel.com/48/48/people?v='+Date.now()
    };
    if ( msg.constructor == String ) {
        req.text = msg;
    } else {
        mergeObjects(req, msg);
    }
    
    slack_bot.reply(resp, req);
}


function parseMessage() {
    var base = Array.prototype.splice.call(arguments, 0, 1)[0].trim().split(/[\s\,]+/g);
    var result = {};
    for ( var i = 0, len = Math.min(arguments.length, base.length); i < len; i++ ) {
        def(arguments[i]) && (result[arguments[i]] = base[i]);
    }
    if ( base.length > arguments.length ) {
        result.args = base.slice(arguments.length);
    }
    return result;
}


var statusToColor = {
    'def': '#000000',
    'new': '#eeeeee',
    'to_do': '#009ad6',
    'in_progress': '#ffc014',
    'done': '#44d600',
    'cancelled': '#44d600'
}

function formatJiraUser(user) {
    if ( !user ) {
        return {
            displayName: 'Unassigned'
        }
    }
    return user;
}

function formatIssue2(issue) {
    if ( !issue ) { return null; }
    var req = {
        title: [issue.key, issue.fields.status.name].join(': '),
        title_link: issue.self,
        text: issue.fields.summary,
        color: statusToColor[issue.fields.status.name.toLowerCase().replace(/\s+/,'_')]
    };
    if (issue.fields.assignee ) {
        mergeObjects(req, {
            author_name: issue.fields.assignee.displayName,
            author_link: issue.fields.assignee.self,
        });
    }
    return req;
}


// Reporter: Name
// Assignee: Name
// Severity: Major
// Labels: <List>
// Status: New

// Task Name

// Short description
function formatIssue(issue) {
    if ( !issue ) { return null; }
    console.log('\n\n',issue,'\n\n');
    var req = {
        fields: [],
        color: statusToColor[issue.fields.status.name.toLowerCase().replace(/\s+/,'_')]
    };
    
    issue.fields.reporter = formatJiraUser(issue.fields.reporter);
    issue.fields.assignee = formatJiraUser(issue.fields.assignee);
    
    req.fields.push({
        title: 'Reporter',
        value: issue.fields.reporter.displayName,
        short: true
    });
    req.fields.push({
        title: 'Assignee',
        value: issue.fields.assignee.displayName,
        short: true
    });
    
    req.fields.push({
        title: 'Severity',
        value: issue.fields.priority.name,
        short: true
    });
    
    req.fields.push({
        title: 'Labels',
        value: issue.fields.labels.join(' '),
        short: true
    });
    
    req.fields.push({
        title: 'Status',
        value: issue.fields.status.name,
        short: true
    });
    
    req.title = issue.fields.summary;
    req.title_link = [config.jira.protocol,config.jira.host,'/',config.jira.path.task,issue.key].join('');
    req.footer = issue.fields.description;
    return req;
}



MODEL.MessageHandler.declare.push(()=>{
    
    // status
    new MessageHandler('status', (self, t, user, resp)=> {
        sendAsBot(resp, `${escape(user.name)}`,'STATUS');
    });
    
    // hello
    new MessageHandler(/(^|\W)(hello|hi|yo)($|\W)/gi, (self, text, user, resp) => {
        sendAsBot(resp, `Hi, ${escape(user.name)}`);
    } );
    
    // tasks summary
    new MessageHandler(/(^|\W)tasks($|\W)/gi, (self, text, user, slackResp) => {
        var req = parseMessage(text, null, 'name', 'status');
        req.status = req.status || 'available';
        
        if ( !req.name || req.name == 'me' ) {
            req.name = user.jira_name;
        }
        
        if ( !req.name ) {
            sendAsBot(slackResp, 'Failed to identify user');
            return 0;
        }
        
        jira.searchJira(`status in (${config.jira.status[req.status]}) AND assignee in (${req.name}) order by updated DESC`, req.options, (error, resp) => {
            
            var msgData = {
                text: `${escape(req.name)}: tasks with status ${escape(req.status)}`,
                attachments: []
            }
            
            resp.issues.forEach(issue => {
                
                console.log('\n\n',issue, '\n', issue.fields.assignee.avatarUrls,'\n\n');
                
                msgData.attachments.push(formatIssue(issue));
            });
            sendAsBot(slackResp, msgData);
            
        });
        
    } );
    
    // task mention
    new MessageHandler(/(^|\W)([A-Z0-9]+\-\d+)($|\W)/g, (self, text, user, slackResp) => {
        var msgData = {
            text: '',
            attachments: []
        }
        var pms = [];
        text.replace(/(^|\W)([A-Z0-9]+\-\d+)($|\W)/g, (t1,t2,issueNumber) => {
            pms.push(new Promise(done => {
                jira.findIssue(issueNumber, function(error, issue) {
                    msgData.attachments.push(formatIssue(issue));
                    done();
                });
            }));
            
        });
        
        Promise.all(pms).then(done => {
            sendAsBot(slackResp, msgData);
            done();
        });
        
    } );
    
});


MODEL.WebSocketClient.declare.push(()=>{
    
    new WebSocketClient('slackChat', {
        
        read: (self, data, ev) => {
            data = JSON.parse(data);
            if ( data.type ) {
                EMIT(['slack','read', data.type], data, ev);
                return new Promise(done => done(data));
            }
        }
    });
    
});



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

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 4001
});

// Add the route
server.route({
    method: 'GET',
    path:'/hello', 
    handler: function (request, reply) {

        return reply('hello world');
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    
    console.log('Server running at:', server.info.uri);
    
    for ( var name in MODEL ) {
        MODEL[name].declare.forEach(worker => worker());
    }
    
    connect_jira();
    connect_slack();
    
    ON('slack/read/message', (bot, data) => {
        console.log('slack/message', data);
        
        if ( data.user ) {
            ORM.fetch('user', {id: data.user}).then(()=>{
                for ( var k in MESSAGEHANDLER ) {
                    MESSAGEHANDLER[k].handle(data);
                }
            });
        }
        
        // if ( data.user ) {
        //     bot.api.users.info({user:data.user}, (err, data) => {
        //         jira.searchUsers(data.user.profile.email, 0, 1, true, true, (err, jdata) => {
        //             console.log('\nUser Slack');
        //             console.log(data.user);
        //             console.log('\nUser Jira ', data.user.profile.email);
        //             console.log(jdata);
        //         });
        //     });
        // }
        
        //- should recieve data with parsed users, teams...
        //-for ( var k in MESSAGEHANDLER ) {
        //-    MESSAGEHANDLER[k].handle(data);
        //-}
    });
    
});
