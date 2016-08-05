const {RtmClient, WebClient, MemoryDataStore, RTM_EVENTS, CLIENT_EVENTS} = require('@slack/client');
import {Connection, Handler} from '../../core/models';
import {SlackMessage} from './slack-message';
import {orm} from '../../server/orm';

import {settings} from './settings';


export const scope : any = {
  webClient : new WebClient(settings.token)
};

export const connection = new Connection('Slack', function () {
  const rtmClient = new RtmClient(settings.token, {
    logLevel  : 'error',
    dataStore : new MemoryDataStore()
  });
  scope.rtmClient = rtmClient;


  // handling connection
  rtmClient.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    scope.user = rtmClient.dataStore.getUserById(rtmClient.activeUserId);
    scope.team = rtmClient.dataStore.getTeamById(rtmClient.activeTeamId);
    console.log('Connected to ' + scope.team.name + ' as ' + scope.user.name);
  });


  // handling response message
  rtmClient.on(RTM_EVENTS.MESSAGE, (response : any) => {
    const regexp      = /<@(U[A-Z0-9]+)>/g;
    const authorSlack = rtmClient.dataStore.getUserById(response.user);

    // better be sure
    if (!authorSlack || !authorSlack.profile) {
      return 0;
    }

    const authorChannel = rtmClient.dataStore.getDMByName(authorSlack.name);

    let message = new SlackMessage({
      authorSlack,
      authorChannel : authorChannel.id,
      text          : response.text,
      channel       : response.channel,
      ts            : response.ts,
      mentions      : {},
      botMention    : false
    });

    for (let match; match = regexp.exec(message.text);) {
      let user = rtmClient.dataStore.getUserById(match[1]);

      message.mentions[match[1]] = user;
      if (user === scope.user) {
        message.botMention = true;
      }
    }

    if (authorSlack.profile.email) {
      orm.models.user.find({email : authorSlack.profile.email}).run((err, userList) => {
        if (!err && userList.length) {
          message.author = userList[0];
          handleMessage(message);
        } else {
          handleMessage(message);
        }
      });
    } else {
      handleMessage(message);
    }

  });

  rtmClient.start();

  return rtmClient;
});


function handleMessage(message : SlackMessage) {
  if (message.botMention) {
    Handler.map.mention.forEach(handler => handler.parse(message, 'mention'));
  } else {
    Handler.map.ambient.forEach(handler => handler.parse(message, 'ambient'));
  }
}
