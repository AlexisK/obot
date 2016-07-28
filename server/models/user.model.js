const orm = require('../orm.service');
orm.declareModel('user', {
  email    : {type : 'text', size : 2048, required : true, unique : true},
  fullName : {type : 'text', size : 2048}
}, {
  validations : {
    email : orm.instance.enforce.patterns.email('such email already registered')
  }
}).then(User => {
  orm.prepare.role.then(Role=> {
    User.hasMany('roles', Role, {}, {
      reverse : 'users', key : true
    });
  });

});
