import {orm} from '../orm';

export const Role = orm.defineModel('role', {
  auth  : {type : 'integer', size : 8, unsigned: true, defaultValue : '0'},
  title : {type : 'text', size : 256, unique : true, required : true}
}, {
  cascadeRemove: true
}, next => {
  orm.models.user.hasMany('roles', orm.models.role, {}, {
    reverse : 'members',
    key     : true
  });
  next();
});
