import Hapi = require('hapi');
import {orm} from './orm';
import {auth} from './auth';

export const server = {
  orm,
  auth,
  hapi : new Hapi.Server()
};
