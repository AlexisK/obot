import {Module} from '../../core/models/module';

import {connection} from './connection';
import {SlackMessage} from './slack-message';
import {settings} from './settings';
import {pingHandler} from './ping.handler';
import {botDushHandler} from './bot-dush.handler';
import * as userSlack from './user.orm-model';

export const slack = new Module({
  connection,
  SlackMessage,
  settings,
  handlers : {pingHandler, botDushHandler},
  ormExtend : userSlack
});
