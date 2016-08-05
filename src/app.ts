import {server} from './server';
import {modules} from './modules';

const {orm, hapi, auth} = server;

hapi.connection({port : 3000});

orm.init().then(() => {
  // connect all modules
  modules
    .forEach((module) =>
      module.connection.connect());

  hapi.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', hapi.info.uri);

    Promise.all([
      orm.fetchItem('role', {
        title : 'member',
        auth  : auth.generateBinary([
          'general'
        ])
      }, {level : 20}),
      orm.fetchItem('role', {
        title : 'devops',
        auth  : auth.generateBinary([
          'general',
          'jiraList'
        ])
      }, {level : 30}),
      orm.fetchItem('role', {
        title : 'admin',
        auth  : auth.generateBinary([
          'all'
        ])
      }, {level : 100})
    ]).then((roles) => {

      const [ member, devops, admin ] = roles;

      orm.fetchItem('user', {
        email    : 'alexey@stuccomedia.com',
        fullName : 'Oleksii Kaliuzhnyi',
        roles    : [admin]
      }, {email : 'alexey@stuccomedia.com'}).then(user => {
        user.getRoles((err, roles) => {
          console.log(`${user.fullName} is a${roles[0].title[0] == 'a' && 'n' || ''} ${roles[0].title}`);
          console.log('OK');
        });

      }).catch(err => console.error(err));

      orm.fetchItem('user', {
        email    : 'nikolay.kobzar@camdenmarket.com',
        fullName : 'Nikolay Kobzar',
        roles    : [devops]
      }, {email : 'nikolay.kobzar@camdenmarket.com'}).then(user => {
        user.getRoles((err, roles) => {
          console.log(`${user.fullName} is a${roles[0].title[0] == 'a' && 'n' || ''} ${roles[0].title}`);
          console.log('OK');
        });

      }).catch(err => console.error(err));


    });

  });
});

