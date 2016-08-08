import {server} from '../server';
const {orm, auth} = server;

import {scope} from '../modules/slack/connection';

export const execute = function (params) : Promise {
  if (!params.roles) {
    console.error('No roles provided for users generation!');
  }
  params.custom = params.custom || {};

  return new Promise((resolve, reject) => {
    scope.webClient.users.list(null, function (err, response : any) {
      if (err) {
        throw err;
      }

      if (response.ok) {
        response.members.forEach(slackUser => {
          createUser(slackUser, params);
        });
      }

    });
  });
};


function createUser(slackUser : any, params : any) {
  let email = slackUser.profile.email;

  if (email) {
    let roles;

    if (params.custom[email]) {
      roles = params.custom[email].map(k => params.roles[k]);
    } else {
      roles = [params.roles.member];
    }

    let fullName = slackUser.real_name || slackUser.name;

    orm.fetchItem('user', {email, roles, fullName}, {email}).then(user => {
      user.getRoles((err, roles) => {
        console.log(`${new Array(30 - user.fullName.length).join(' ')}${user.fullName}  is a${roles[0].title[0] == 'a' && 'n' || ' '} ${roles[0].title}`);
      });

    }).catch(err => console.error(err));
  }
}

