exports.up = function (next) {
  this.createTable('roles', {
    id       : {type : "serial", key : true},
    title    : {type : 'text', size : 256, required : true, unique : true}
  }, next);
};

exports.down = function (next) {
  this.dropTable('roles', next);
};
