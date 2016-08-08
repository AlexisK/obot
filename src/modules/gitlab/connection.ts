import gitlab = require('gitlab');

import { Connection } from '../../core/models/connection';
import { settings } from './settings';

export const connection = new Connection('Gitlab', function () {
  return gitlab({ url: settings.url, token: settings.token });
});
