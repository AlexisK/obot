import { Module } from '../../core/models/module';

import { handlers } from './handlers';
import { connection } from './connection';
import { settings } from './settings';

export const jira = new Module({ handlers, connection, settings });
