require('./nodes');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({port : 3000});

server.start((err) => {
  if ( err ) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);

  const orm = require('./server').orm;
  orm.init().then(db => {
    orm.model.role.create({title:'member',level:20}, () => {});
    orm.model.role.create({title:'admin',level:200}, () => {});

    orm.model.user.create({
      email: 'test@qwe.ru',
      fullName: 'Vasia'
    }, () => {});
  });

});
