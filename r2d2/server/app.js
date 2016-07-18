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
