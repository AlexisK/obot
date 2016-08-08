const merge = require('lodash/merge');
import {Module} from '../../core/models/module';

import * as generalHandlers from './general';
import * as serverHandlers from './server';
const handlers = merge({}, generalHandlers, serverHandlers);

export const stucco = new Module({handlers});
