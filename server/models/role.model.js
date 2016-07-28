const orm = require('../orm.service');
orm.declareModel('role', {
  level : {type : 'integer', required: true, unique : true, defaultValue: 0 },
  title : {type : 'text', size : 256, required: true, unique : true}
});
