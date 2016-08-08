import {Module} from '../../core/models/module';

import {handler} from './handler';
import {formatter} from './formatter';

export const weather = new Module({handler, formatter});
