const {RtmClient, WebClient, MemoryDataStore, RTM_EVENTS, CLIENT_EVENTS} = require('@slack/client');
import {Connection, Handler} from '../../core/models';
import {SlackMessage} from './slack-message';

import {settings} from './settings';


export const scope : any = {
  webClient: new WebClient(settings.token)
};

export const connection  = new Connection('Slack', function () {
  const rtmClient = new RtmClient(settings.token, {
    logLevel : 'error',
    dataStore: new MemoryDataStore()
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
    const regexp = /<@(U[A-Z0-9]+)>/g;
    let message  = new SlackMessage({
      text       : response.text,
      channel    : response.channel,
      author     : rtmClient.dataStore.getUserById(response.user),
      mentions   : {},
      bot_mention: false
    });


    for (let match; match = regexp.exec(message.text);) {
      let user = rtmClient.dataStore.getUserById(match[1]);

      message.mentions[match[1]] = user;
      if (user === scope.user) {
        message.bot_mention = true;
      }
    }


    if (message.bot_mention) {
      Handler.map.mention.forEach(handler => handler.parse(message, 'mention'));
    } else {
      Handler.map.ambient.forEach(handler => handler.parse(message, 'ambient'));
    }

  });

  rtmClient.start();

  return rtmClient;
});
