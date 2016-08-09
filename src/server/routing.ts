const Hapi      = require('hapi');
const path      = require('path');
const Inert     = require('inert');
const randtoken = require('rand-token');

import {getRequest} from '../core/utils/http-request';
import {scope} from '../modules/slack/connection';
import {orm} from './orm';
import {auth} from './auth';

const {SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_REDIRECT_URI} = require('../../settings.json');

export const router : any = new Hapi.Server();

router.connection({port : 3000});
router.register(Inert, () => {
});

// App
router.route({
  method  : 'GET',
  path    : '/',
  handler : {
    file : path.resolve(__dirname, '../client/index.html')
  }
});

// Authentication
router.route({
  method  : 'GET',
  path    : '/slack_auth/',
  handler : function (request : any, reply : any) {
    if (request.query.code) {
      getRequest('https://slack.com/api/oauth.access', {
        client_id     : SLACK_CLIENT_ID,
        client_secret : SLACK_CLIENT_SECRET,
        code          : request.query.code,
        redirect_uri  : SLACK_REDIRECT_URI
      }, {
        parseJson : true
      }).then(resp => {
        if (resp.ok) {
          console.log(resp);
          let user = scope.rtmClient.dataStore.getUserById(resp.user.id);

          // retrieve user
          orm.models.user.find({email : user.profile.email}).run((err, userList) => {
            if (!err && userList.length) {
              user = userList[0];

              // create session
              orm.models.session.create({
                token    : randtoken.suid(16),
                owner_id : user.id
              }, (err, success) => {
                if (err) {
                  console.error('Failed to create session');
                  throw err;
                }
                reply(`Slack auth<br/>Success!<br/>Created session with token ${success.token}<script type="text/javascript">localStorage.setItem("token","${success.token}");location.replace("/")</script>`);
              });


            }
          });

        }

      });
    }

  }
});


// Api methods next
function validateRequestUser(request : any) {
  return new Promise((resolve, reject) => {
    try {
      let data = JSON.parse(request.payload);
      if (!data.token) {
        reject();
      }

      orm.models.session.find({token : data.token}).run((err, sessions) => {
        if (err) {
          throw(err);
        }
        if (!sessions.length) {
          reject();
          console.error('No sessions found!');
          return 0;
        }

        sessions[0].getOwner((err, author) => {
          if (err) {
            throw err;
          }
          console.log(author.email);
          resolve(author);
        })
      });
    } catch (err) {
      reject(err);
    }
  });
}

router.route({
  method  : 'POST',
  path    : '/users/list',
  handler : function (request : any, reply : any) {
    console.log(request.payload);
    validateRequestUser(request).then(author => {

      return auth.checkUserAuth(author, ['manageUsers']).then(() => {
        orm.models.user.find({}, (err, userList) => {
          reply(JSON.stringify(userList));
        });
      });

    }).catch(()=> {
      reply('Unauth!');
    });
  }
});
