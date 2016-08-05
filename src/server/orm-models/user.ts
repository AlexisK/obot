import {orm} from '../orm';

export const User = orm.defineModel('user', {
  email      : {type: 'text', size: 2048, unique: true, required: true, index: true},
  fullName   : {type: 'text', size: 4096}
});
