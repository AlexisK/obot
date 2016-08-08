import {server} from './server';
const {orm, hapi} = server;

import {modules} from './modules';

hapi.connection({port : 3000});

const customRoles = {
  'aleksandr.omitisynskyi@camdenmarket.com' : ['devops'],
  'boris.lapouga@camdenmarket.com'          : ['admin'],
  'nikolay.kobzar@camdenmarket.com'         : ['admin'],
  'alexey@stuccomedia.com'                  : ['debug'],
  'fernando@stuccomedia.com'                : ['debug'],
};

import {execute as createRoles} from './fixtures/defaultRoles';
import {execute as createUsers} from './fixtures/slackUsers';


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

    createRoles().then((roleMapping) => {
      createUsers({
        roles  : roleMapping,
        custom : customRoles
      });

    });

  });
});

