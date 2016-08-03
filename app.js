const {server, orm} = require('./server');

server.connection({port : 3000});

orm.init().then(db => {
  require('./nodes');

  server.start((err) => {
    if ( err ) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);

    //level - rolemask

    orm.fetchItem('role', {
      level : 100,
      title : 'admin'
    }, {level : 1}).then(role => {

      orm.fetchItem('user', {
        email    : 'alexey@stuccomedia.com',
        fullName : 'Oleksii Kaliuzhnyi',
        roles    : [role]
      }, {email : 'alexey@stuccomedia.com'}).then(user => {
        user.getRoles((err, roles) => {
          console.log(`${user.fullName} is a ${roles[0].title}`);
          console.log('OK');
        });

      }).catch(err => console.error(err));
    });

  });
});


