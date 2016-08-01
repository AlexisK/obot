const orm = require('../orm.service');

orm.defineModel('role', {
  level : {type : 'number', unique : true},
  title : {type : 'text', size : 256, unique : true}
}, null, next => {
  orm.models.user.hasMany('roles', orm.models.role, {}, {
    reverse : 'members',
    key     : true
  });
  next();
});
