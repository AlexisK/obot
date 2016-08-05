import { orm } from '../orm';

export const Role = orm.defineModel('role', {
  level  : {type : 'integer', size : 4, unique : true, required : true},
  rights : {type : 'object'},
  title  : {type : 'text', size : 256, unique : true, required : true}
}, null, next => {
  orm.models.user.hasMany('roles', orm.models.role, {}, {
    reverse : 'members',
    key     : true
  });
  next();
});
