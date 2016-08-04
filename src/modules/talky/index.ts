import {Module} from '../../core/models/module';

import {helloHandler} from './hello.handler';
import {whyHandler} from './why.handler';
import {swearHandler} from './swear.handler';

export const talky = new Module({handlers: {helloHandler, whyHandler, swearHandler}});
