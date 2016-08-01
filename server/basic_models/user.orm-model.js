var orm = require('../orm.service');

module.exports = orm.defineModel('user', {
  email    : {type : 'text', size : 2048, unique : true, index : true},
  fullName : {type : 'text', size : 4096}
});
