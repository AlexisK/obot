import {server} from './server';
const {orm, router} = server;

import {modules} from './modules';

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

  // start server
  router.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', router.info.uri);

    // load data from fixtures
    createRoles().then((roleMapping) => {
      createUsers({
        roles  : roleMapping,
        custom : customRoles
      });

    });

  });
});

