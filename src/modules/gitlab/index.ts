import { Module } from '../../core/models/module';

import { connection } from './connection';
import { settings } from './settings';

export const gitlab = new Module({ connection, settings });
