const Hapi      = require('hapi');
const path      = require('path');
const Inert     = require('inert');
const randtoken = require('rand-token');

import {getRequest} from '../core/utils/http-request';
import {scope} from '../modules/slack/connection';
import {orm} from './orm';
import {auth} from './auth';
import {ConnectionService} from './connection';

const {SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_REDIRECT_URI} = require('../../settings.json');

export const router : any = new Hapi.Server();

router.connection({port : 3000});
router.register(Inert, () => {
});

// App
router.route({
  method  : 'GET',
  path    : '/{file*}',
  handler : {
    directory : {
      path  : 'build/client/',
      index : true
    }
  }
});
router.route({
  method  : 'GET',
  path    : '/node_modules/{file*}',
  handler : {
    directory : {
      path : 'node_modules/'
    }
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


// Api

router.route({
  method  : 'POST',
  path    : '/api/',
  handler : function (requestData : any, reply : any) {
    let request = ConnectionService.parseRequestData(requestData);

    ConnectionService.parseRequest(request).then(request => {
      auth.checkUserAuth(request.author, [`${request.model}_${request.command}`]).then(() => {
        orm[request.command](request).then(data => reply(JSON.stringify(data)));
      });
    }).catch(err => {
      reply(JSON.stringify({
        exception : err.message
      }));
    });

  }
});
