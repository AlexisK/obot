import { Module } from '../../core/models/module';

import { connection } from './connection';
import { SlackMessage } from './slack-message';
import { settings } from './settings';
import { pingHandler } from './ping.handler';

export const slack = new Module({ connection, SlackMessage, settings, pingHandler });
