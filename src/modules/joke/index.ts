import {Module} from '../../core/models/module';

import {lolHandler} from './lol.handler';
import {grandpaHandler} from './grandpa.handler';

export const joke = new Module({handlers: {lolHandler, grandpaHandler}});
