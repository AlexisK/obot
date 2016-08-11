import {server} from '../server';
const {orm, auth} = server;

export const execute = function () : Promise {
  return new Promise((resolve, reject) => {
    Promise.all([
      orm.fetchItem('role', {
        title : 'member',
        auth  : auth.generateBinary([
          'general',
          'user_retrieve',
          'role_retrieve'
        ])
      }, {title : 'member'}),
      orm.fetchItem('role', {
        title : 'devops',
        auth  : auth.generateBinary([
          'general',
          'user_retrieve',
          'role_retrieve',
          'jiraList',
          'envInit',
          'envDeploy',
          'envRestart'
        ])
      }, {title : 'devops'}),
      orm.fetchItem('role', {
        title : 'admin',
        auth  : auth.generateBinary([
          'all'
        ])
      }, {title : 'admin'}),
      orm.fetchItem('role', {
        title : 'debug',
        auth  : auth.generateBinary([
          'all'
        ])
      }, {title : 'debug'})
    ]).then(result => {
      resolve({
        member : result[0],
        devops : result[1],
        admin  : result[2],
        debug  : result[3]
      });
    })
  });
};

